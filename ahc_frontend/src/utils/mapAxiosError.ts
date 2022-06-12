import { AxiosError } from 'axios';

export default function mapAxiosError(error: AxiosError) {
  if (error.response?.data?.errors) {
    const { errors } = error!.response!.data!;

    if (Object.keys(errors).length > 0) {
      return errors[Object.keys(errors)[0]];
    }
  }

  return error.response?.data?.errors?.detail || error.message;
}
