### User_private database

| Field    | Type   | Required | Notes       |
| -------- | ------ | -------- | ----------- |
| \_id     | ID     | Y        | Primary key |
| username | String | Y        |             |
| password | String | Y        | Encrypted   |

---

### Item database

| Field               | Type     | Required | Notes                     |
| ------------------- | -------- | -------- | ------------------------- |
| \_ID                | ID       | Y        | Primary key               |
| listing_title       | String   | Y        |                           |
| listing_description | String   | Y        |                           |
| listing_price       | Number   | N        | Value in currency (euros) |
| listing_image       | String   | Y        |                           |
| listing_category    | Category | Y        |                           |

### Order database
| Field               | Type     | Required | Notes                     |
| ------------------- | -------- | -------- | ------------------------- |
| \_ID                | ID       | Y        | Primary key               |
| user_id             | ID       | Y        |                           |
| orderItems          | Array    | Y        |                           |
| shippingAddress     | Object   | Y        |                           |
| paymentMethod       | String   | Y        |                           |
| paymentResult       | Object   | Y        |                           |
| totalPrice          | Number   | Y        |                           |
