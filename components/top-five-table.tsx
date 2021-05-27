import Title from './title';
import { GetDashboardQuery } from '../graphql/generated/graphql';
import TableFooter from './table-footer';
import Table from './table';

interface TopFiveTableProps {
  reviews: GetDashboardQuery['reviews'];
  selectCats?: GetDashboardQuery['selectCats'];
  selectProducts?: GetDashboardQuery['selectProducts'];
  onReviewSaveSuccess?: () => void;
  title: string;
  footerType: 'HOMEPAGE' | 'PRODUCTS';
  numberOfProducts: number;
}

const TopFiveTable = ({
  reviews,
  selectCats,
  selectProducts,
  title,
  numberOfProducts,
  onReviewSaveSuccess,
}: TopFiveTableProps) => {
  return (
    <>
      <Title title={title} />

      <Table
        reviews={reviews}
        Footer={
          <TableFooter
            selectCats={selectCats!}
            selectProducts={selectProducts!}
            onSaveSuccess={onReviewSaveSuccess}
          />
        }
        numberOfProducts={numberOfProducts}
        offsetNumber={0}
      />
    </>
  );
};

export default TopFiveTable;
