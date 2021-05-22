import { gql } from '@apollo/client';

export const ADD_CAT = gql`
  mutation AddCat($cat: Cat_insert_input!) {
    insert_Cat(objects: [$cat]) {
      returning {
        id
        age
        image_url
        name
        type
        doctor_email
        color
        daily_food
        specials: SpecialRequirements {
          name
        }
      }
    }
  }
`;

export const ADD_REVIEW = gql`
  mutation AddReview($review: Review_insert_input!) {
    insert_Review(objects: [$review]) {
      returning {
        product: Product {
          id
          name
          brand_type
          price
          image_url
        }
        cat: Cat {
          id
        }
        updated_at
        review_type
      }
    }
  }
`;

export const UPDATE_CAT = gql`
  mutation UpdateCat($id: Int, $cats: Cat_set_input) {
    update_Cat(where: { id: { _eq: $id } }, _set: $cats) {
      affected_rows
      returning {
        id
        name
        age
        note
        type
        weight
        daily_food
        color
        nickname
      }
    }
  }
`;

export const DELETE_CAT = gql`
  mutation DeleteCat($id: Int!) {
    delete_Cat_by_pk(id: $id) {
      id
    }
  }
`;
