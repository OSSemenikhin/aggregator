<ul class="{{ $classNameList ?? '' }} d-flex">
    @if($tg)
        <li class="{{ $classNameItem }} me-2">
            <x-contact-telegram href="{{ $tg }}" />
        </li>
    @endif
    @if($whatsapp)
        <li class="{{ $classNameItem }} me-2">
            <x-contact-whatsapp href="{{ $whatsapp }}" />
        </li>
    @endif
    @if($phone)
        <li class="{{ $classNameItem }}">
            <x-contact-phone href="tel:{{ $phone }}" />
        </li>
    @endif
</ul>