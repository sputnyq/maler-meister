import { TimePicker, TimePickerProps } from '@mui/x-date-pickers';

export function TimeCaptureTimePicker(props: TimePickerProps<Date>) {
  return <TimePicker<Date> closeOnSelect minutesStep={5} slotProps={{ textField: { size: 'small' } }} {...props} />;
}
