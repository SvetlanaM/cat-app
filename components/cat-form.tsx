import React, { useCallback, useEffect, useMemo } from 'react';
import {
  Cat_Insert_Input,
  Cat_Set_Input,
  CatTypeEnum_Enum as catTypes,
  CatFieldsFragmentFragment,
  GetCatByIdQuery,
} from '../graphql/generated/graphql';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import FormErrorMessage from './form-error-message';
import FormLegend from './form-legend';
import FormInputWrapper from './form-input-wrapper';
import FormInputLabel from './form-input-label';
import FormInput from './form-input';
import FormSelectBox from './form-select-box';
import BackButton from '../components/back-button';
import SubmitButton from '../components/submit-button';
import ErrorScreen from './error-screen';
import { getUser } from '../utils/user';
import sk from '../public/locales/sk/common.json';

export type CatInputData = Omit<Cat_Insert_Input, 'CatTypeEnum'>;
interface CatFormInterface {
  handleSubmit1: {
    (cat: CatInputData | Cat_Set_Input): Promise<boolean>;
  };
  submitText: string;
  catData?: CatFieldsFragmentFragment;
}

const CatForm = ({ handleSubmit1, submitText, catData }: CatFormInterface) => {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const noteInputName = 'note';
  const watchedNote: string | undefined = watch(noteInputName);

  const onSubmit = useCallback(
    (data) => {
      const catInput: CatInputData | Cat_Set_Input = {
        age: Number(data.age),
        name: data.name,
        user_id: getUser(),
        doctor_email: data.doctor_email,
        nickname: data.nickname,
        weight: Number(data.weight),
        type: data.type,
        note: data.note,
        color: data.color,
        daily_food: Number(data.daily_food),
        id: catData ? catData.id : null,
      };

      handleSubmit1(catInput).then((success: boolean) => {
        if (success) {
          console.log('jupiii');
          if (catData) {
            router.push('/my-cats');
          } else {
            router.push('/');
          }
        } else {
          alert('Data sa nepodarilo ulozit');
        }
      });
    },
    [handleSubmit1]
  );

  const catTypeOptions = useMemo(() => {
    let newEnum = ['CAT_TYPE_NULL', ...Object.values(catTypes).sort()];
    return newEnum.map((item) => {
      return (
        <option value={item} key={item}>
          {t(sk[item] || sk['CAT_TYPE_NULL'])}
        </option>
      );
    });
  }, [catTypes]);

  useEffect(() => {
    if (catData) {
      let fields = Object.keys(catData).slice(1);
      for (let field of fields) {
        setValue(field, catData[field]);
      }
    }
  }, [catData]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <fieldset>
        <FormLegend name="Zakladne informacie" />
        <div className="grid grid-cols-2 gap-10">
          <FormInputWrapper>
            <FormInputLabel name="Meno macky*" />
            <FormInput
              registerRules={{
                ...register('name', {
                  required: { value: true, message: 'Meno macky je povinne' },
                  maxLength: {
                    value: 100,
                    message: 'Meno macky je max do 100 znakov',
                  },
                }),
              }}
              type="text"
              placeholder="Meno macky do 100 znakov"
              errors={errors.name}
            />
            {errors.name && <FormErrorMessage error={errors.name?.message} />}
          </FormInputWrapper>
          <FormInputWrapper>
            <FormInputLabel name="Prezyvka macky" />
            <FormInput
              registerRules={{ ...register('nickname', { required: false }) }}
              type="text"
              // defaultValue={catData.nickname}
            />
          </FormInputWrapper>
        </div>
        <div className="grid grid-cols-2 gap-10">
          <FormInputWrapper>
            <FormInputLabel name="Vek macky" />
            <FormInput
              registerRules={{
                ...register('age', { min: 0.5, max: 30, required: false }),
              }}
              type="number"
              errors={errors.age}
              placeholder="Vek od 0,5 do 30 rokov"
            />
            {errors.age && <FormErrorMessage error="Vek od 0,5 do 30 rokov" />}
          </FormInputWrapper>
          <FormInputWrapper>
            <FormInputLabel name="Farba macky" />
            <FormInput
              registerRules={{ ...register('color', { required: false }) }}
              type="text"
            />
          </FormInputWrapper>
        </div>
        <div className="grid grid-cols-2 gap-10">
          <FormInputWrapper>
            <FormInputLabel name="Vaha macky" />
            <FormInput
              registerRules={{ ...register('weight', { required: false }) }}
              type="number"
              placeholder="1,5 kg"
            />
          </FormInputWrapper>
          <FormInputWrapper>
            <FormInputLabel name="Denna davka" />
            <FormInput
              registerRules={{ ...register('daily_food', { required: false }) }}
              type="number"
              placeholder="700g/denne"
            />
          </FormInputWrapper>
        </div>
        <div className="grid grid-cols-2 gap-10 mt-3">
          <FormInputWrapper>
            <FormInputLabel name="Email veterinara" />
            <FormInput
              registerRules={{
                ...register('doctor_email', { required: false }),
              }}
              type="email"
              placeholder="email@email.sk"
            />
          </FormInputWrapper>
          <FormInputWrapper>
            <FormInputLabel name="Typ macky" />
            <FormSelectBox
              registerRules={{ ...register('type', { required: false }) }}
            >
              {catTypeOptions}
            </FormSelectBox>
          </FormInputWrapper>
        </div>
      </fieldset>
      {/* <fieldset>
          <FormLegend name="Specialne poziadavky" />
        </fieldset>
        <fieldset>
          <FormLegend name="Oblubene jedla" />
        </fieldset> */}
      <fieldset>
        <div className="flex flex-col w-full mt-2">
          <FormInputLabel name="Poznamka" />
          <textarea
            maxLength={500}
            {...register('note', {
              required: false,
              maxLength: {
                value: 500,
                message: 'Maximalne 500 znakov',
              },
            })}
            placeholder="Dodatocne poznamky. Maximalne 500 znakov."
            className="form-textarea w-full mb-3 mt-2 text-purple block border-rounded-base border-gray 
              focus:outline-none focus:bg-white focus:border-gray
              focus:border focus:ring-gray focus:ring-opacity-50 placeholder-gray"
          ></textarea>
          <span className="text-sm font-light text-gray">
            {watchedNote !== undefined && watchedNote.length <= 500
              ? `Ostava ${500 - watchedNote?.length} znakov z 500`
              : null}
          </span>
          {errors.note && <FormErrorMessage error={errors.note} />}
        </div>
      </fieldset>
      <BackButton url={'/'} />
      <SubmitButton text={submitText} disabled={false} size="w-1/4" />
    </form>
  );
};

export default CatForm;
