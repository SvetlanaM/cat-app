import { gql } from '@apollo/client';
import { CatFieldsFragment } from '../components/cat-box';
import { TipFieldsFragment } from '../components/tip-box';
import { ReviewFieldsFragment } from '../components/table-row';

export const CATS_QUERY = gql`
  query GetCats {
    cats: Cat(order_by: { name: asc }, where: { is_active: { _eq: true } }) {
      ...CatFieldsFragment
    }
  }
  ${CatFieldsFragment}
`;

export const DASHBOARD_QUERY = gql`
  query GetDashboard($limitProducts: Int, $limitTips: Int, $catIds: [Int!]) {
    reviews: Review(
      order_by: { review_type: desc, updated_at: desc }
      where: { cat_id: { _in: $catIds } }
      limit: $limitProducts
    ) {
      ...ReviewFieldsFragment
      id
    }
    tips: Tip(
      order_by: { created_at: desc }
      where: { is_active: { _eq: true } }
      limit: $limitTips
    ) {
      ...TipFieldsFragment
    }
  }
  ${ReviewFieldsFragment}
  ${TipFieldsFragment}
`;
