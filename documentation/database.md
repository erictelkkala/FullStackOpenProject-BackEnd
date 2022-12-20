### User_public database

| Field       | Type   | Required | Notes       |
| ----------- | ------ | -------- | ----------- |
| \_ID        | ID     | Y        | Primary key |
| Username    | String | Y        |             |
| Displayname | String | Y        |             |
| Email       | String | Y        |             |
| PhoneNumber | String | N        |             |

---

### User_private database

| Field    | Type   | Required | Notes       |
| -------- | ------ | -------- | ----------- |
| \_ID     | ID     | Y        | Primary key |
| Username | String | Y        |             |
| Password | String | Y        | Encrypted   |

---

### Item database

| Field            | Type   | Required | Notes                     |
| ---------------- | ------ | -------- | ------------------------- |
| \_ID             | ID     | Y        | Primary key               |
| Listing_title    | String | Y        |                           |
| Listing_body     | String | Y        |                           |
| Listing_price    | Number | N        | Value in currency (euros) |
| Listing_location | String | Y        |                           |
| User_reference   | ID     | Y        |                           |
