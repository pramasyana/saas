<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    private const FK_TABLES = [
        ['table' => 'tenants', 'column' => 'user_id', 'on_delete' => 'set null'],
        ['table' => 'subscriptions', 'column' => 'user_id', 'on_delete' => 'cascade'],
        ['table' => 'email_logs', 'column' => 'user_id', 'on_delete' => 'cascade'],
        ['table' => 'leaves', 'column' => 'approved_by', 'on_delete' => 'set null'],
        ['table' => 'sessions', 'column' => 'user_id', 'on_delete' => null],
    ];

    public function up(): void
    {
        // Cleanup from previous failed run
        Schema::dropIfExists('_user_id_map');

        // Skip if users already has UUID primary key (already migrated)
        $columnType = DB::selectOne(
            "SELECT DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'id' AND TABLE_SCHEMA = DATABASE()"
        );
        if ($columnType && in_array(strtolower($columnType->DATA_TYPE), ['char', 'varchar'])) {
            return;
        }

        $driver = DB::connection()->getDriverName();

        if ($driver === 'sqlite') {
            DB::statement('PRAGMA foreign_keys=OFF');
        } else {
            DB::statement('SET FOREIGN_KEY_CHECKS=0');
        }

        $this->fixTokenableColumn();

        if ($driver === 'sqlite') {
            $this->storeMapping();
            $this->rebuildUsersSqlite();
            $this->convertFkColumns();
            $this->dropMapping();
        } else {
            $this->dropAllForeignKeys();
            $this->storeMapping();
            $this->fixTenantIdMysql();
            $this->convertUsersMysql();
            $this->convertFkColumns();
            $this->restoreForeignKeys();
            $this->dropMapping();
        }
    }

    private function fixTokenableColumn(): void
    {
        if (! Schema::hasTable('personal_access_tokens')) {
            return;
        }

        $driver = DB::connection()->getDriverName();
        $columns = Schema::getColumnListing('personal_access_tokens');

        if (! in_array('tokenable_id', $columns, true)) {
            return;
        }

        if ($driver === 'sqlite') {
            Schema::table('personal_access_tokens', function (Blueprint $table) {
                $table->string('tokenable_id', 36)->nullable()->change();
            });
        } else {
            DB::statement('ALTER TABLE personal_access_tokens MODIFY tokenable_id VARCHAR(36) NULL');
        }
    }

    private function storeMapping(): void
    {
        Schema::dropIfExists('_user_id_map');

        Schema::create('_user_id_map', function (Blueprint $table) {
            $table->bigInteger('old_id')->primary();
            $table->uuid('new_id');
        });

        DB::table('users')->orderBy('id')->each(function ($user) {
            DB::table('_user_id_map')->insert([
                'old_id' => $user->id,
                'new_id' => (string) Str::uuid(),
            ]);
        });
    }

    private function dropMapping(): void
    {
        Schema::dropIfExists('_user_id_map');
    }

    private function fixTenantIdMysql(): void
    {
        DB::statement('ALTER TABLE users MODIFY tenant_id VARCHAR(36) NULL');
    }

    private function rebuildUsersSqlite(): void
    {
        Schema::create('users_new', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('tenant_id', 36)->nullable();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
            $table->boolean('is_admin')->default(false);
            $table->boolean('is_active')->default(true);
        });

        DB::table('users')->orderBy('id')->each(function ($user) {
            DB::table('users_new')->insert([
                'id' => DB::table('_user_id_map')
                    ->where('old_id', $user->id)
                    ->value('new_id'),
                'tenant_id' => $user->tenant_id ?: null,
                'name' => $user->name,
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at,
                'password' => $user->password,
                'remember_token' => $user->remember_token,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
                'is_admin' => (bool) $user->is_admin,
                'is_active' => (bool) $user->is_active,
            ]);
        });

        Schema::drop('users');
        Schema::rename('users_new', 'users');
    }

    private function convertUsersMysql(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->uuid('uuid')->nullable()->unique()->after('id');
        });

        DB::table('users')->orderBy('id')->each(function ($user) {
            $uuid = DB::table('_user_id_map')
                ->where('old_id', $user->id)
                ->value('new_id');
            DB::table('users')->where('id', $user->id)->update(['uuid' => $uuid]);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropPrimary('id');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('id');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->renameColumn('uuid', 'id');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->primary('id');
        });
    }

    private function convertFkColumns(): void
    {
        foreach (self::FK_TABLES as $fk) {
            $this->convertSingleColumn($fk['table'], $fk['column']);
        }
    }

    private function convertSingleColumn(string $table, string $column): void
    {
        $tempColumn = $column.'_uuid';
        $driver = DB::connection()->getDriverName();

        Schema::table($table, function (Blueprint $table) use ($tempColumn) {
            $table->string($tempColumn, 36)->nullable();
        });

        DB::table($table)->whereNotNull($column)->orderBy('id')->each(function ($row) use ($table, $column, $tempColumn) {
            $uuid = DB::table('_user_id_map')
                ->where('old_id', $row->$column)
                ->value('new_id');

            if ($uuid) {
                DB::table($table)
                    ->where('id', $row->id)
                    ->update([$tempColumn => $uuid]);
            }
        });

        if ($driver === 'sqlite') {
            $this->convertSingleColumnSqlite($table, $column, $tempColumn);
        } else {
            Schema::table($table, function (Blueprint $table) use ($column) {
                $table->dropColumn($column);
            });

            Schema::table($table, function (Blueprint $table) use ($tempColumn, $column) {
                $table->renameColumn($tempColumn, $column);
            });
        }
    }

    private function convertSingleColumnSqlite(string $table, string $column, string $tempColumn): void
    {
        $newName = $table.'_new';

        $createSql = DB::selectOne("SELECT sql FROM sqlite_master WHERE type='table' AND name='{$table}'")->sql;
        $createSql = $this->removeForeignKeyConstraints($createSql, $column);
        $createSql = preg_replace(
            '/,\s*"'.preg_quote($tempColumn, '/').'"\s+\w+(?:\([^)]*\))?(?:\s+(?:NOT\s+NULL|NULL|DEFAULT\s+[^\s,]+|PRIMARY\s+KEY|AUTOINCREMENT|UNIQUE|REFERENCES\s+[^)]+\))*)*(?=\s*(?:,|\)))/i',
            '',
            $createSql,
        );
        $createSql = str_replace("\"{$table}\"", "\"{$newName}\"", $createSql);
        $createSql = preg_replace(
            '/"'.preg_quote($column, '/').'"\s+\w+(?:\([^)]*\))?(?:\s+(?:NOT\s+NULL|NULL|DEFAULT\s+[^\s,]+|PRIMARY\s+KEY|AUTOINCREMENT|UNIQUE|REFERENCES\s+[^)]+\))*)*(?=\s*[,\)])/i',
            '"'.$column.'" VARCHAR(36)',
            $createSql,
        );

        DB::statement($createSql);

        $cols = DB::select("PRAGMA table_info('{$table}')");
        $selectCols = [];
        foreach ($cols as $col) {
            if ($col->name === $tempColumn) {
                $selectCols[] = "\"{$tempColumn}\" as \"{$column}\"";
            } elseif ($col->name === $column) {
                continue;
            } else {
                $selectCols[] = "\"{$col->name}\"";
            }
        }
        $selectList = implode(', ', $selectCols);
        DB::statement("INSERT INTO \"{$newName}\" SELECT {$selectList} FROM \"{$table}\"");

        $indexes = DB::select("SELECT name, sql FROM sqlite_master WHERE type='index' AND tbl_name='{$table}' AND sql IS NOT NULL");
        foreach ($indexes as $idx) {
            DB::statement("DROP INDEX IF EXISTS \"{$idx->name}\"");
            $idxSql = str_replace("\"{$table}\"", "\"{$newName}\"", $idx->sql);
            DB::statement($idxSql);
        }

        Schema::drop($table);
        Schema::rename($newName, $table);
    }

    private function removeForeignKeyConstraints(string $createSql, string $keepColumn): string
    {
        $lines = explode("\n", $createSql);
        $newLines = [];
        $skipNext = false;

        foreach ($lines as $line) {
            $trimmed = trim($line);

            if (preg_match('/FOREIGN KEY\s*\(/i', $trimmed)) {
                if (preg_match('/\('.preg_quote($keepColumn, '/').'\s*\)/i', $trimmed)) {
                    if (! str_ends_with(trim($trimmed, ','), ')')) {
                        $skipNext = true;
                    }

                    continue;
                }
            }

            if ($skipNext) {
                if (str_ends_with(trim($trimmed, ','), ')')) {
                    $skipNext = false;
                }

                continue;
            }

            $newLines[] = $line;
        }

        return implode("\n", $newLines);
    }

    private function dropAllForeignKeys(): void
    {
        $fks = [
            ['table' => 'tenants', 'columns' => ['user_id']],
            ['table' => 'subscriptions', 'columns' => ['user_id']],
            ['table' => 'email_logs', 'columns' => ['user_id']],
            ['table' => 'leaves', 'columns' => ['approved_by']],
            ['table' => 'sessions', 'columns' => ['user_id']],
        ];

        foreach ($fks as $fk) {
            foreach ($fk['columns'] as $column) {
                try {
                    Schema::table($fk['table'], function (Blueprint $table) use ($column) {
                        $table->dropForeign([$column]);
                    });
                } catch (Throwable) {
                    // FK might not exist in some environments
                }
            }
        }
    }

    private function restoreForeignKeys(): void
    {
        foreach (self::FK_TABLES as $fk) {
            try {
                Schema::table($fk['table'], function (Blueprint $table) use ($fk) {
                    $constraint = $table
                        ->foreign($fk['column'])
                        ->references('id')
                        ->on('users');

                    if ($fk['on_delete'] === 'cascade') {
                        $constraint->cascadeOnDelete();
                    } elseif ($fk['on_delete'] === 'set null') {
                        $constraint->nullOnDelete();
                    }
                });
            } catch (Throwable) {
                // Some environments (like SQLite) may not support FK restoration
            }
        }
    }

    public function down(): void
    {
        throw new RuntimeException('This migration cannot be reversed.');
    }
};
