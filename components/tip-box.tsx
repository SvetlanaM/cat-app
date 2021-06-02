import Link from 'next/link';
import { gql } from '@apollo/client';
import { TipFieldsFragmentFragment } from '../graphql/generated/graphql';
import Image from './image';

export const TipFieldsFragment = gql`
  fragment TipFieldsFragment on Tip {
    id
    name
    slug
    category_machine_name
    category
    perex
    description
  }
`;

interface TipBoxInterface {
  name: TipFieldsFragmentFragment['name'];
  slug: TipFieldsFragmentFragment['slug'];
  category_machine_name?: string;
  order?: string;
  isOnDashboard: boolean;
  readingTime?: number;
}

const TipBox = ({
  name,
  slug,
  category_machine_name,
  order,
  isOnDashboard,
  readingTime,
}: TipBoxInterface) => {
  return (
    <div className="w-full pb-3.6 mb-4 border-b border-gray">
      <Link href={`/tips/${encodeURIComponent(slug)}`}>
        <a className="small-purple-text font-light flex flex-row items-center justify-between">
          <div>
            {!isOnDashboard ? (
              <Image
                src={`/icons/${category_machine_name}.svg`}
                height={20}
                className="mr-4 inline"
              />
            ) : (
              order
            )}
            {name}
          </div>
          <div>
            {!isOnDashboard ? (
              <span className="mr-3 flex flex-row mt-1 text-purple">
                <Image
                  src={`/icons/clock.svg`}
                  height={10}
                  width={15}
                  className="mr-2 inline-block"
                />
                {readingTime} min. čítania
                <Image
                  src={`/icons/more.svg`}
                  height={10}
                  width={8}
                  className="ml-3 inline-block"
                />
              </span>
            ) : (
              <Image
                src={`/icons/more.svg`}
                height={10}
                width={8}
                className="ml-3 inline-block"
              />
            )}
          </div>
        </a>
      </Link>
    </div>
  );
};

export default TipBox;
