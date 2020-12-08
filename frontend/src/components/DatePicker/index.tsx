import React, { useRef, useEffect } from 'react';
import ReactDatePicker, {
  ReactDatePickerProps,
  registerLocale,
} from 'react-datepicker';
import { useField } from '@unform/core';
import 'react-datepicker/dist/react-datepicker.css';

import ptbr from 'date-fns/locale/pt-BR';

import { DatePickerCss } from './styles';

registerLocale('pt-BR', ptbr);

// interface Props extends Omit<ReactDatePickerProps, 'onChange'> {
//   name: string;
// }

interface Props extends ReactDatePickerProps {
  name: string;
}

const DatePicker: React.FC<Props> = ({ name, ...rest }) => {
  const datepickerRef = useRef(null);
  const { fieldName, registerField, defaultValue, error } = useField(name);
  // const [date, setDate] = useState(defaultValue || null);
  useEffect(() => {
    registerField({
      name: fieldName,
      ref: datepickerRef.current,
      path: 'props.selected',
      clearValue: (ref: any) => {
        ref.clear();
      },
    });
  }, [fieldName, registerField]);
  return (
    <DatePickerCss>
      <ReactDatePicker
        ref={datepickerRef}
        // selected={date}
        // onChange={setDate}

        {...rest}
      />
    </DatePickerCss>
  );
};
export default DatePicker;
