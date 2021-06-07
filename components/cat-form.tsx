import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Cat_Insert_Input,
  Cat_Set_Input,
  CatTypeEnum_Enum as catTypes,
  CatFieldsFragmentFragment,
  GetProductsQuery,
  SelectProductFieldsFragment,
  Review_Insert_Input,
  ReviewHistory_Insert_Input,
} from '../graphql/generated/graphql';
import {
  useForm,
  Controller,
  useFieldArray,
  useWatch,
  Control,
} from 'react-hook-form';
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
import { getUser } from '../utils/user';
import sk from '../public/locales/sk/common.json';
import UploadImage from './upload-image';
import { DEFAULT_CAT_IMAGE as defaultImage } from '../utils/constants';
import { useS3Upload } from 'next-s3-upload';

export type CatInputData = Omit<Cat_Insert_Input, 'CatTypeEnum'>;
import ProductController from './product-controller';
import RatingController from './rating-controller';
import useSearch from '../hooks/useSearch';
interface CatFormInterface {
  handleSubmit1: {
    (
      cat: CatInputData | Cat_Set_Input,
      reviews: [Review_Insert_Input] | [ReviewHistory_Insert_Input]
    ): Promise<boolean>;
  };
  submitText: string;
  catData?: CatFieldsFragmentFragment;
  products?: GetProductsQuery['products'];
}

const CatForm = ({
  handleSubmit1,
  submitText,
  catData,
  products,
}: CatFormInterface) => {
  const catImage = useMemo<string>(
    () => (catData && catData.image_url ? catData.image_url : defaultImage),
    [catData]
  );
  const [imageUrl, setImageUrl] = useState<string>(catImage);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { FileInput, openFileDialog, uploadToS3 } = useS3Upload();
  const { t } = useTranslation();
  const [searchProducts, setSearchProducts] = useState<
    Array<SelectProductFieldsFragment>
  >([]);
  const [searchTerm, setSearchTerm] = useState('');

  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: catData && catData.name,
      nickname: catData && catData.nickname,
      age: catData && catData.age,
      color: catData && catData.color,
      weight: catData && catData.weight,
      cat_image: catData && catData.image_url,
      daily_food: catData && catData.daily_food,
      doctor_email: catData && catData.doctor_email,
      note: '',
      type: catData && catData.type,
      fieldArray:
        catData &&
        catData.reviews.map((item) => {
          return {
            rating: item.products.reviewhistory.map(
              (item) => item.review_type
            )[0],
            product: item.products.name,
          };
        }),
    },
  });

  let index;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'fieldArray',
  });

  const watchFieldArray = watch('fieldArray');
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  const noteInputName = 'note';
  const watchedNote: string | undefined = watch(noteInputName);
  const getUniqueReviews = () => {
    return Array.from(new Set(products.map((item) => item.name))).map(
      (name) => {
        return products.find((item) => item.name === name);
      }
    );
  };
  const [limitedSearchProducts, setLimitedSearchedProducts] = useState<
    Array<SelectProductFieldsFragment>
  >(getUniqueReviews());

  useSearch(searchTerm, limitedSearchProducts, setSearchProducts);

  useEffect(() => {
    let userProductsArray =
      watchFieldArray && watchFieldArray.map((item) => item.product);

    if (userProductsArray && userProductsArray.length > 0) {
      setLimitedSearchedProducts((prevState) =>
        prevState.filter((x) => !userProductsArray.includes(x))
      );
    }
  }, [searchTerm]);

  const handleFileChange = async (file: File) => {
    setIsLoading(true);
    if (checkFileType(file)) {
      let { url } = await uploadToS3(file);
      setImageUrl(url);
      setIsLoading(false);
    } else {
      alert('Nepodporovaný formát');
    }
  };

  const fileTypes = ['png', 'jpg', 'gif', 'webp', 'jpeg'];
  const checkFileType = (file: File) => {
    if (file) {
      let value = file.name;
      let fileType = value.substring(value.lastIndexOf('.') + 1, value.length);
      if (fileTypes.indexOf(fileType) > -1) {
        return true;
      } else {
        return false;
      }
    }
  };

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
        image_url: imageUrl,
      };
      const reviewsInput = data.fieldArray;

      handleSubmit1(catInput, reviewsInput).then((success: boolean) => {
        if (success) {
          console.log('jupiii2');
          if (catData) {
            router.push('/my-cats');
          } else {
            router.push('/');
          }
        } else {
          alert('Dáta sa nepodarilo uložiť');
        }
      });
    },
    [handleSubmit1, imageUrl]
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

  // useEffect(() => {
  //   if (catData) {
  //     let fields1 = Object.keys(catData).slice(1);
  //     for (let field of fields1) {
  //       setValue(field, catData[field]);
  //     }
  //   }
  // }, [catData]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <fieldset>
        <FormLegend name="Základné informácie" />
        <div>
          <UploadImage
            imageUrl={imageUrl}
            openFileDialog={openFileDialog}
            isLoading={isLoading}
          />
          <Controller
            name="cat_image"
            control={control}
            rules={{
              required: false,
              validate: {
                checkFileType: checkFileType,
              },
            }}
            render={() => (
              <FileInput
                onChange={handleFileChange}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
              />
            )}
            {...(errors.cat_image &&
              errors.cat_image.type === 'checkFileType' && (
                <FormErrorMessage
                  error={`Nahrajte subor v jednom z tychto formatov ${fileTypes}`}
                />
              ))}
          />
        </div>
        <div className="grid grid-cols-2 gap-10">
          <FormInputWrapper>
            <FormInputLabel name="Meno mačky*" />
            <FormInput
              registerRules={{
                ...register('name', {
                  required: { value: true, message: 'Meno mačky je povinné' },
                  maxLength: {
                    value: 100,
                    message: 'Meno mačky je max do 100 znakov',
                  },
                }),
              }}
              type="text"
              placeholder="Meno mačky do 100 znakov"
              errors={errors.name}
            />
            {errors.name && <FormErrorMessage error={errors.name?.message} />}
          </FormInputWrapper>
          <FormInputWrapper>
            <FormInputLabel name="Prezývka mačky" />
            <FormInput
              registerRules={{ ...register('nickname', { required: false }) }}
              type="text"
            />
          </FormInputWrapper>
        </div>
        <div className="grid grid-cols-2 gap-10">
          <FormInputWrapper>
            <FormInputLabel name="Vek mačky" />
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
            <FormInputLabel name="Farba mačky" />
            <FormInput
              registerRules={{ ...register('color', { required: false }) }}
              type="text"
            />
          </FormInputWrapper>
        </div>
        <div className="grid grid-cols-2 gap-10">
          <FormInputWrapper>
            <FormInputLabel name="Váha mačky v kg" />
            <FormInput
              registerRules={{ ...register('weight', { required: false }) }}
              type="number"
              placeholder="1,5 kg"
            />
          </FormInputWrapper>
          <FormInputWrapper>
            <FormInputLabel name="Denná dávka v g" />
            <FormInput
              registerRules={{ ...register('daily_food', { required: false }) }}
              type="number"
              placeholder="700g/denne"
            />
          </FormInputWrapper>
        </div>
        <div className="grid grid-cols-2 gap-10 mt-3">
          <FormInputWrapper>
            <FormInputLabel name="Email veterinára" />
            <FormInput
              registerRules={{
                ...register('doctor_email', { required: false }),
              }}
              type="email"
              placeholder="email@email.sk"
            />
          </FormInputWrapper>
          <FormInputWrapper>
            <FormInputLabel name="Typ mačky" />
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
        </fieldset> */}
      <fieldset>
        <FormLegend name="Obľúbené jedlá mačky" />
        {controlledFields.map((field, index) => {
          return (
            <div
              key={field.id}
              className="flex justify-between items-center mb-5"
            >
              <div className="w-1/2 pr-3">
                <ProductController
                  searchProducts={searchProducts}
                  onInputChange={(e) => {
                    setSearchTerm(e);
                  }}
                  name={`fieldArray.${index}.product`}
                  {...register(`fieldArray.${index}.product` as const)}
                  defaultValue={field.product}
                  control={control}
                  showHint={false}
                />
              </div>
              <div className="pl-0 w-2/6">
                <RatingController
                  name={`fieldArray.${index}.rating`}
                  control={control}
                  defaultValue={field.rating}
                  isDisabled={false}
                  placeholder={'Vybrať hodnotenie (1-5)'}
                  {...register(`fieldArray.${index}.rating` as const)}
                />
              </div>
              <button
                type="button"
                className="mt-8 text-red-500"
                onClick={() => remove(index)}
              >
                - Odobrať
              </button>
            </div>
          );
        })}
        <button
          type="button"
          className=" text-purple mb-3 font-semibold"
          onClick={() => append({})}
        >
          + Pridať hodnotenie
        </button>
      </fieldset>
      <fieldset>
        <div className="flex flex-col w-full mt-2">
          <FormInputLabel name="Poznámka" />
          <textarea
            maxLength={500}
            {...register('note', {
              required: false,
              maxLength: {
                value: 500,
                message: 'Maximálne 500 znakov',
              },
            })}
            placeholder="Dodatočné poznámky. Maximálne 500 znakov."
            className="form-textarea w-full mb-3 mt-2 text-purple block border-rounded-base border-gray 
              focus:outline-none focus:bg-white focus:border-gray
              focus:border focus:ring-gray focus:ring-opacity-50 placeholder-gray"
          ></textarea>
          <span className="text-sm font-light text-gray">
            {watchedNote !== undefined && watchedNote.length <= 500
              ? `Ostáva ${500 - watchedNote?.length} znakov z 500`
              : null}
          </span>
          {errors.note && <FormErrorMessage error={errors.note} />}
        </div>
      </fieldset>
      <div className="mt-8">
        <BackButton url={'/'} />
        <SubmitButton text={submitText} disabled={false} size="w-1/4" />
      </div>
    </form>
  );
};

export default CatForm;
