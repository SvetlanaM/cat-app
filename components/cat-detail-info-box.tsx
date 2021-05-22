import Image from '../components/image';
import {
  CatDetailFieldsFragmentFragment,
  DeleteCatMutation,
  DeleteCatMutationVariables,
} from '../graphql/generated/graphql';
import CatBasicInfo from '../components/cat-basic-info';
import Link from 'next/link';
import RemoveConfirmationModal from '../components/remove-confirmation-modal';
import { useCallback, useState } from 'react';
import { useMutation } from '@apollo/client';
import { DELETE_CAT } from '../graphql/mutations';
import router, { Router } from 'next/router';
import { CATS_DETAIL_QUERY, CATS_QUERY } from '../graphql/queries';
import { TIP_LIMIT } from '../utils/constants';
import { getUser } from '../utils/user';
interface CatDetailInfoBoxProps {
  data: CatDetailFieldsFragmentFragment;
}
const CatDetailInfoBox = ({ data }: CatDetailInfoBoxProps) => {
  const [modalIsOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const [deleteCat] = useMutation<
    DeleteCatMutation,
    DeleteCatMutationVariables
  >(DELETE_CAT, {
    refetchQueries: [
      {
        query: CATS_DETAIL_QUERY,
        variables: {
          user_id: getUser(),
          limit: 5,
          withProducts: true,
          limitProducts: 5,
          brand_type: 'Feringa',
        },
      },
    ],
  });

  const deleteMyCat = useCallback(async () => {
    try {
      const result = await deleteCat({
        variables: {
          id: data.id,
        },
      });
      if (result.data?.delete_Cat_by_pk.id) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
      return false;
    }
  }, [deleteCat]);

  const afterDeletion = () => {
    deleteMyCat();
    deleteMyCat().then(() => closeModal());
  };

  return (
    <div className="grid grid-cols-4 divide-x divide-gray_lightest border-rounded-base border-gray">
      <div className="flex small-purple-text text-left my-cat">
        <div className="flex flex-row px-3 align-middle py-3 justify-between cat-detail-box">
          <CatBasicInfo cat={data} />
        </div>
      </div>
      <div className="flex small-purple-text text-left my-cat">
        <div className="px-5">
          <ul className="small-light-text justify-evenly flex flex-col cat-detail-box">
            <li>
              <span className="text-gray">Pohlavie:</span> --
            </li>
            <li>
              <span className="text-gray">Prezývka:</span>{' '}
              {data.nickname || '--'}
            </li>
            <li>
              <span className="text-gray">Farba:</span> {data.color || '--'}
            </li>
          </ul>
        </div>
      </div>
      <div className="flex small-purple-text text-left my-cat">
        <div className="px-5">
          <ul className="small-light-text justify-evenly flex flex-col cat-detail-box">
            <li>
              <span className="text-gray">Váha:</span> {data.weight || '--'} kg
            </li>
            <li>
              <span className="text-gray">Email doktora:</span> --
            </li>
            <li>
              <span className="text-gray">Denná dávka:</span>{' '}
              {data.daily_food || '--'} g
            </li>
          </ul>
        </div>
      </div>
      <div className="grid grid-flow-row divide-y border-gray">
        <div className="edit-box flex flex-row items-center justify-start pl-3">
          <Image src="/icons/change_stars.svg" height={20} width={20} />
          <p className="uppercase text-gray text-sm ml-2 font-light">
            <Link href={`/my-cats/${encodeURIComponent(data.id)}`}>
              Upraviť mačku
            </Link>
          </p>
        </div>
        <div className="delete-box flex flex-row items-center justify-start pl-3">
          <Image src="/icons/delete.svg" height={20} width={20} />
          <p className="uppercase text-gray text-sm ml-2 font-light">
            <Link href="/my-cats">
              <a onClick={openModal}>Vymazať mačku</a>
            </Link>
          </p>
          <RemoveConfirmationModal
            isOpen={modalIsOpen}
            closeModal={closeModal}
            rest={data.name}
            onClickAction={afterDeletion}
          />
        </div>
      </div>
    </div>
  );
};

export default CatDetailInfoBox;
