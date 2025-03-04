import PropTypes from "prop-types";

export default function SelectComp({
  options,
  defaultValue,
  value,
  onChangeFunc,
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChangeFunc(event.target.value)}
    >
      <option key={defaultValue} disabled value="">
        {defaultValue}
      </option>
      {options.map((option) => (
        <option key={option.value} value="{option.value}">
          {option.name}
        </option>
      ))}
    </select>
  );
}

SelectComp.PropTypes = {
  options: PropTypes.array,
  defaultValue: PropTypes.string,
  value: PropTypes.string,
  onChangeFunc: PropTypes.func,
};
