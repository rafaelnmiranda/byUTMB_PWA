"use client";

type FilterTab = {
  value: string;
  label: string;
};

type FilterTabsProps = {
  tabs: FilterTab[];
  activeValue: string;
  onChange: (value: string) => void;
};

const FilterTabs = ({ tabs, activeValue, onChange }: FilterTabsProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {tabs.map((tab) => {
        const isActive = tab.value === activeValue;

        return (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={`whitespace-nowrap rounded-2xl border px-4 py-2 text-sm font-semibold transition-colors ${
            isActive
              ? "border-strong bg-[var(--card-hover)] text-brand-teal"
              : "border-subtle bg-surface-alt text-muted hover:border-strong hover:text-primary"
          }`}
        >
          {tab.label}
        </button>
      );
      })}
    </div>
  );
};

export default FilterTabs;
