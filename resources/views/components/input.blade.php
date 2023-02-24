{{--
    @param $name                       -- атрибут name
    @param $classNamesWrapper          -- имена классов обёртки
    @param $inputId                    -- ид поля ввода
    @param $classNamesInput            -- имена классов поля ввода
    @param $type                       -- тип инпута
    @param $classNamesLabel            -- имена классов лэйбла
    @param $label                      -- текст лэйбла
    @param $description                -- текст блока с описанием
    @param $descriprionId              -- ид блока с описанием
    @param $classNamesDescription      -- имена классов для поля с описанием
    @params $required                  -- required
--}}

<div {{ $classNamesWrapper ? 'class=' . $classNamesWrapper : '' }}>
    <label
        for="{{ $inputId }}"
        class="form-label {{ $classNamesLabel ?? '' }}"
    >{{ $label }}</label>
    <input
        id="{{ $inputId }}"
        class="form-control {{ $classNamesInput ?? '' }} @error($name ?? 'error') is-invalid @enderror"
        type="{{ $type }}"
        name="{{ $name }}"
        value="{{ old($name) }}"
        {{ isset($description) ? 'aria-describedby=' . $description : '' }}
        {{ isset($required) ? "required" : "" }}
    >
    @if (isset($description))
        <div
            class="form-text {{ $classNamesDescription ?? '' }}"
            {{ $descriprionId ? "id=" . $descriprionId : ""}}
        >{{ $description }}</div>
    @endif
    @error($name)
        <p class="invalid-feedback">{{ $message }}</p>
    @enderror
    @error('error')
        <p class="invalid-feedback">{{ $message }}</p>
    @enderror
</div>