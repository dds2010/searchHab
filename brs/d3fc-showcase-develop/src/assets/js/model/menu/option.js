export default function(displayString, valueString, option, icon) {
    return {
        displayString: displayString, // TODO: is 'displayName' better?
        valueString: valueString, // TODO: is this an id?
        option: option, // TODO: Ideally, remove.
        isSelected: false,
        icon: icon
    };
}
