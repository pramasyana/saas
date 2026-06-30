import { useCallback } from 'react';
import ReactSelect from 'react-select';
import type { Props as ReactSelectProps, StylesConfig } from 'react-select';
import AsyncSelect from 'react-select/async';
import { cn } from '@/lib/utils';

export interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps {
    value: string;
    onChange: (value: string) => void;
    options?: SelectOption[];
    loadOptions?: (search: string) => Promise<SelectOption[]>;
    placeholder?: string;
    searchable?: boolean;
    clearable?: boolean;
    disabled?: boolean;
    className?: string;
    error?: boolean;
}

const styles: StylesConfig<SelectOption, false> = {
    control: (base, state) => ({
        ...base,
        borderRadius: '0.75rem',
        borderWidth: '1px',
        borderColor: state.isFocused
            ? 'var(--color-primary)'
            : 'var(--color-neutral-300)',
        boxShadow: state.isFocused
            ? '0 0 0 2px rgba(124, 58, 237, 0.3)'
            : '0 1px 2px rgba(0, 0, 0, 0.05)',
        minHeight: 'unset',
        backgroundColor: state.isDisabled ? 'var(--color-neutral-50)' : '#fff',
        cursor: state.isDisabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
        '&:hover': {
            borderColor: state.isFocused
                ? 'var(--color-primary)'
                : 'var(--color-neutral-400)',
        },
    }),
    valueContainer: (base) => ({
        ...base,
        padding: '6px 8px',
        fontSize: '0.875rem',
    }),
    placeholder: (base) => ({
        ...base,
        color: 'var(--color-neutral-400)',
        fontSize: '0.875rem',
    }),
    singleValue: (base) => ({
        ...base,
        color: 'var(--color-neutral-900)',
        fontSize: '0.875rem',
    }),
    input: (base) => ({
        ...base,
        color: 'var(--color-neutral-900)',
        fontSize: '0.875rem',
    }),
    menu: (base) => ({
        ...base,
        borderRadius: '0.75rem',
        border: '1px solid var(--color-neutral-200)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        marginTop: '6px',
        zIndex: 50,
        overflow: 'hidden',
    }),
    menuList: (base) => ({
        ...base,
        padding: '4px',
        maxHeight: '240px',
    }),
    option: (base, state) => ({
        ...base,
        borderRadius: '0.5rem',
        padding: '8px 12px',
        fontSize: '0.875rem',
        backgroundColor: state.isSelected
            ? 'var(--color-primary-50)'
            : state.isFocused
                ? 'var(--color-neutral-100)'
                : 'transparent',
        color: state.isSelected
            ? 'var(--color-primary)'
            : 'var(--color-neutral-700)',
        fontWeight: state.isSelected ? 500 : 400,
        cursor: 'pointer',
        transition: 'all 0.15s',
        '&:active': {
            backgroundColor: state.isSelected
                ? 'var(--color-primary-50)'
                : 'var(--color-neutral-100)',
        },
    }),
    dropdownIndicator: (base, state) => ({
        ...base,
        color: 'var(--color-neutral-400)',
        transition: 'transform 0.2s',
        transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        cursor: 'pointer',
        padding: '8px',
    }),
    clearIndicator: (base) => ({
        ...base,
        color: 'var(--color-neutral-400)',
        cursor: 'pointer',
        padding: '8px',
        '&:hover': {
            color: 'var(--color-neutral-600)',
        },
    }),
    indicatorsContainer: (base) => ({
        ...base,
        gap: '2px',
    }),
    noOptionsMessage: (base) => ({
        ...base,
        fontSize: '0.875rem',
        color: 'var(--color-neutral-500)',
        padding: '24px 16px',
    }),
    loadingMessage: (base) => ({
        ...base,
        fontSize: '0.875rem',
        color: 'var(--color-neutral-500)',
        padding: '24px 16px',
    }),
    menuPortal: (base) => ({
        ...base,
        zIndex: 9999,
    }),
};

const components: ReactSelectProps<SelectOption, false>['components'] = {
    DropdownIndicator: (props) => {
        return (
            <div {...props.innerProps} className="flex items-center px-2">
                <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </div>
        );
    },
    ClearIndicator: (props) => {
        return (
            <div {...props.innerProps} className="flex cursor-pointer items-center rounded p-0.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
        );
    },
    LoadingIndicator: () => (
        <div className="flex items-center px-2">
            <svg className="h-4 w-4 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
        </div>
    ),
};

function toReactValue(value: string, options: SelectOption[]): SelectOption | null {
    return options.find((o) => o.value === value) ?? null;
}

export default function Select({
    value,
    onChange,
    options = [],
    loadOptions,
    placeholder = 'Pilih...',
    searchable = true,
    clearable = false,
    disabled = false,
    className,
    error = false,
}: SelectProps) {
    const handleChange = useCallback(
        (option: SelectOption | null) => {
            onChange(option?.value ?? '');
        },
        [onChange],
    );

    const load = useCallback(
        (inputValue: string) => loadOptions?.(inputValue) ?? Promise.resolve([]),
        [loadOptions],
    );

    const sharedProps: ReactSelectProps<SelectOption, false> = {
        value: toReactValue(value, options),
        onChange: handleChange,
        isClearable: clearable,
        isDisabled: disabled,
        isSearchable: searchable,
        placeholder,
        styles,
        components,
        menuPortalTarget: typeof document !== 'undefined' ? document.body : null,
        noOptionsMessage: () => 'Tidak ada data.',
    };

    return (
        <div className={cn(className, error && '[&_.css-1d8n9bt]:border-danger [&_.css-1d8n9bt]:ring-danger/20')}>
            {loadOptions ? (
                <AsyncSelect
                    {...sharedProps}
                    loadOptions={load}
                    defaultOptions
                    loadingMessage={() => 'Memuat...'}
                />
            ) : (
                <ReactSelect {...sharedProps} options={options} />
            )}
        </div>
    );
}
