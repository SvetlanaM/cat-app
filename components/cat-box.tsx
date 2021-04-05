import { gql } from '@apollo/client';
import Image from 'next/image';
import { useState, useMemo } from 'react';
import {
  CatFieldsFragmentFragment,
  GetCatsQuery,
} from '../graphql/generated/graphql';
import { useTranslation } from 'next-i18next';
import { DEFAULT_CAT_IMAGE as defaultImage } from '../utils/constants';
import CatToggleDetail from './cat-toggle-detail';

export const CatFieldsFragment = gql`
  fragment CatFieldsFragment on Cat {
    age
    id
    image_url
    name
    type
    slug
    doctor_email
  }
`;

interface CatBoxProps {
  CatFieldsFragment: CatFieldsFragmentFragment;
  reviews: GetCatsQuery['cats'];
}

const CatBox = ({ CatFieldsFragment, reviews }: CatBoxProps) => {
  let catProducts = [];
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleSlider = () => setIsOpen(!isOpen);

  // toto je tu uplne zbytocne teraz
  const catImage = useMemo<string>(
    () =>
      CatFieldsFragment.image_url ? CatFieldsFragment.image_url : defaultImage,
    [CatFieldsFragment.image_url]
  );

  Object.keys(reviews).map((product) => {
    catProducts.push(reviews[product].products);
  });

  const catData = {
    reviews: catProducts,
    doctor_email: CatFieldsFragment.doctor_email,
    specials: [],
  };

  return (
    <div className="flex flex-col flex-no-wrap justify-between h-75 py-3 border-rounded-base border-gray small-purple-text text-left my-cat">
      <div className="flex flex-row px-3">
        <Image
          alt={CatFieldsFragment.name}
          src={catImage}
          width={65}
          height={65}
          className="border-rounded-base"
        />
        <div className="flex-col-base justify-between ml-3">
          <h4>{CatFieldsFragment.name}</h4>
          <p className="small-light-text">{CatFieldsFragment.type}</p>
          <p className="small-light-text text-gray">
            {CatFieldsFragment.age
              ? t('years.key', { count: CatFieldsFragment.age })
              : '--'}
          </p>
        </div>
        {catData && (
          <button
            type="button"
            onClick={toggleSlider}
            aria-haspopup
            aria-expanded={isOpen}
            id={CatFieldsFragment.name}
            className="focus:outline-none ml-auto"
          >
            {isOpen ? (
              <Image
                src="/icons/down.svg"
                height={8}
                width={15}
                quality={100}
                className="transform rotate-180"
              />
            ) : (
              <Image
                src="/icons/down.svg"
                height={8}
                width={15}
                quality={100}
              />
            )}
          </button>
        )}
      </div>
      {isOpen ? (
        <div aria-labelledby={CatFieldsFragment.name}>
          <CatToggleDetail catData={catData} />
        </div>
      ) : null}
    </div>
  );
};

export default CatBox;
