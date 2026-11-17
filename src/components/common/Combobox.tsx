import React, { useState, useRef, useEffect, useId, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';

export interface ComboboxItem {
  code: string;
  name: string;
}

export interface ComboboxGroup {
  grupo?: string;
  itens: ComboboxItem[];
}

interface ComboboxProps {
  id?: string;
  value: string;
  onChange: (code: string, name: string) => void;
  grupos: ComboboxGroup[];
  placeholder?: string;
  disabled?: boolean;
  carregando?: boolean;
  vazio?: string;
  livre?: boolean;
  textoLivre?: (term: string) => string;
  rotulo?: string;
  className?: string;
}

const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export const Combobox: React.FC<ComboboxProps> = ({
  id,
  value,
  onChange,
  grupos,
  placeholder = 'Selecione…',
  disabled = false,
  carregando = false,
  vazio = 'Nada encontrado.',
  livre = false,
  textoLivre = (term) => `Buscar por “${term}”`,
  rotulo,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const generatedId = useId();
  const listboxId = `listbox-${id || generatedId}`;

  // All items across groups
  const allItems = useMemo(() => grupos.flatMap((g) => g.itens), [grupos]);
  const currentItem = allItems.find((i) => i.code === value);
  const displayLabel = currentItem?.name ?? (carregando ? '' : rotulo || value);

  // Filtered groups with limit to 400 items for instant rendering
  const filteredGroups = useMemo(() => {
    const q = normalize(query.trim());
    let limit = 400;
    return grupos
      .map((g) => {
        const filtered = (q
          ? g.itens.filter((item) =>
              normalize(`${item.name} ${g.grupo ?? ''}`).includes(q)
            )
          : g.itens
        ).slice(0, Math.max(0, limit));
        limit -= filtered.length;
        return { ...g, itens: filtered };
      })
      .filter((g) => g.itens.length > 0);
  }, [grupos, query]);

  // Flattened filtered items
  const flattenedFiltered = useMemo(
    () => filteredGroups.flatMap((g) => g.itens),
    [filteredGroups]
  );

  const exactMatch = flattenedFiltered.some(
    (i) => normalize(i.name) === normalize(query.trim())
  );
  const showCustomOption = livre && query.trim().length >= 2 && !exactMatch;
  const totalOptions = flattenedFiltered.length + (showCustomOption ? 1 : 0);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (livre && query.trim() && !currentItem) {
          onChange(query.trim(), query.trim());
        }
        setIsOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, query, livre, currentItem, onChange]);

  // Reset highlight index when query or open state changes
  useEffect(() => {
    setHighlightIndex(0);
  }, [query, isOpen]);

  const handleSelect = (item: ComboboxItem) => {
    onChange(item.code, item.name);
    setQuery('');
    setIsOpen(false);
  };

  const handleSelectCustom = () => {
    const custom = query.trim().slice(0, 80);
    if (custom) {
      onChange(custom, custom);
      setQuery('');
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
      setHighlightIndex((prev) => Math.min(totalOptions - 1, prev + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIsOpen(true);
      setHighlightIndex((prev) => Math.max(0, prev - 1));
    } else if (e.key === 'Enter') {
      if (isOpen) {
        e.preventDefault();
        if (showCustomOption && highlightIndex === 0) {
          handleSelectCustom();
        } else {
          const itemIdx = showCustomOption ? highlightIndex - 1 : highlightIndex;
          if (flattenedFiltered[itemIdx]) {
            handleSelect(flattenedFiltered[itemIdx]);
          } else if (livre && query.trim()) {
            handleSelectCustom();
          }
        }
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
    }
  };

  const isControlDisabled = disabled || carregando;

  return (
    <div ref={containerRef} className={`relative ${isOpen ? 'z-[60]' : 'z-10'} ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          autoComplete="off"
          disabled={isControlDisabled}
          placeholder={carregando ? 'Carregando…' : placeholder}
          value={isOpen ? query : displayLabel}
          onFocus={() => {
            if (!isControlDisabled) {
              setIsOpen(true);
              setQuery('');
            }
          }}
          onClick={() => {
            if (!isControlDisabled) {
              setIsOpen(true);
            }
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className={`w-full h-11 px-3 bg-[#161922] border border-[#282e3b] rounded-xl text-[13px] text-gray-200 placeholder-gray-500 focus:border-[#fa2600] focus:outline-none transition-colors pr-8 ${
            isOpen ? 'cursor-text ring-1 ring-[#fa2600]/40' : 'cursor-pointer'
          } ${isControlDisabled ? 'opacity-50 cursor-not-allowed bg-[#111318]' : ''}`}
        />
        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform" />
      </div>

      {isOpen && !isControlDisabled && (
        <div
          id={listboxId}
          ref={listRef}
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-[100] max-h-80 min-w-[16rem] overflow-y-auto rounded-xl border border-[#262c3b] bg-[#141720] p-1 shadow-2xl shadow-black/90"
        >
          {showCustomOption && (
            <div
              role="option"
              aria-selected={highlightIndex === 0}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelectCustom();
              }}
              onMouseEnter={() => setHighlightIndex(0)}
              className={`cursor-pointer rounded-lg px-3 py-2 text-sm transition-colors ${
                highlightIndex === 0
                  ? 'bg-[#fa2600]/20 text-[#fa2600] font-semibold'
                  : 'text-orange-400 hover:bg-[#fa2600]/10'
              }`}
            >
              {textoLivre(query.trim())}
            </div>
          )}

          {filteredGroups.map((group, gIdx) => {
            return (
              <div key={group.grupo || gIdx}>
                {group.grupo && (
                  <p className="px-3 pb-1 pt-2.5 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    {group.grupo}
                  </p>
                )}
                {group.itens.map((item) => {
                  const globalIdx =
                    flattenedFiltered.findIndex((it) => it.code === item.code) +
                    (showCustomOption ? 1 : 0);
                  const isSelected = item.code === value;
                  const isHighlighted = globalIdx === highlightIndex;

                  return (
                    <div
                      key={item.code}
                      role="option"
                      aria-selected={isSelected}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelect(item);
                      }}
                      onMouseEnter={() => setHighlightIndex(globalIdx)}
                      className={`cursor-pointer rounded-lg px-3 py-2 text-sm transition-colors flex items-center justify-between ${
                        isHighlighted
                          ? 'bg-white/10 text-white'
                          : isSelected
                          ? 'text-[#fa2600] font-medium bg-[#fa2600]/10'
                          : 'text-gray-300 hover:bg-white/5'
                      }`}
                    >
                      <span>{item.name}</span>
                    </div>
                  );
                })}
              </div>
            );
          })}

          {totalOptions === 0 && (
            <p className="px-3 py-2.5 text-xs text-gray-400">{vazio}</p>
          )}

          {allItems.length > flattenedFiltered.length && (
            <p className="px-3 py-2 text-[11px] text-gray-500 border-t border-[#1e2330] mt-1">
              Mostrando {flattenedFiltered.length} de {allItems.length}. Digite para filtrar.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

