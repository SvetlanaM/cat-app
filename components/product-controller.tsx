import { Control, Controller, FieldValues } from 'react-hook-form';
import Select, { components } from 'react-select';
import { customStyles as style } from '../utils/form-styles';
import {
  GetDashboardQuery,
  SelectProductFieldsFragment,
} from '../graphql/generated/graphql';
import { SVETA_EMAIL } from '../utils/constants';
import Link from 'next/link';
import FormInputLabel from './form-input-label';
const customStyles = style;

const Option = ({ children, ...props }) => {
  return (
    <components.Option {...props}>
      <div className="float-left mt-0 mr-3 select-photo">
        {props.data.__typename === 'Product' && (
          <img src={props.data.image_url} className="h-10 w-10" />
        )}
      </div>
      {children}
    </components.Option>
  );
};

interface ProductControllerProps {
  searchProducts: GetDashboardQuery['selectProducts'];
  onInputChange: (value: React.SetStateAction<string>) => void;
  watchedProduct?: SelectProductFieldsFragment;
  props?: Array<string>;
  name: string;
  control: Control<FieldValues>;
  showHint: boolean;
}

const ProductController = ({
  searchProducts,
  onInputChange,
  watchedProduct,
  props,
  name,
  control,
  showHint,
}: ProductControllerProps) => {
  return (
    <>
      {showHint ? (
        <>
          <FormInputLabel name="Produkt*" />
          <div className="text-purple-light text-xs mt-1.5 pl-0.5">
            Nenašli ste hľadaný produkt?{' '}
            <Link href={`mailto: ${SVETA_EMAIL}`}>
              <a className="hover:underline">Napíšte mi :)</a>
            </Link>
          </div>
        </>
      ) : (
        <div className="mb-2">
          <FormInputLabel name="Produkt*" />
        </div>
      )}

      <Controller
        render={({ field, fieldState }) => (
          <Select<SelectProductFieldsFragment>
            {...field}
            {...fieldState}
            styles={customStyles}
            options={searchProducts}
            {...props}
            components={{ Option }}
            getOptionValue={(product: SelectProductFieldsFragment) =>
              product.id.toString()
            }
            getOptionLabel={(product: SelectProductFieldsFragment) =>
              product.name
            }
            onInputChange={onInputChange}
            placeholder="Vyhľadať produkt od 3 znakov"
            value={watchedProduct}
            noOptionsMessage={() => 'Žiadne ďalšie výsledky'}
          />
        )}
        name={name}
        control={control}
        rules={{ required: true }}
        defaultValue={null}
      />
    </>
  );
};

export default ProductController;
