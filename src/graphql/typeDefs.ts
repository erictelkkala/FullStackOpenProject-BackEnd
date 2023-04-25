const typeDefs = `#graphql
    enum Categories{
        Electronics
        Home
        Clothing
        Toys
        Books
        Sports
        Tools
        Other
    }

    type Item {
        id: ID!
        listing_title: String!
        listing_description: String!
        listing_price: Float!
        listing_image: String!
        listing_category: Categories!
        listing_quantity: Int!
    }

    type User {
        id: ID!
        name: String!
        password: String!
    }

    type Token {
        token: String!
    }
    
    type ShippingAddress {
        address: String!
        city: String!
        postalCode: String!
        country: String!
    }

    type PaymentResult {
        id: String!
        paymentStatus: String!
        paymentTime: String!
    }

    type Order {
        id: ID!
        user: User!
        orderItems: [Item!]!
        shippingAddress: ShippingAddress!
        paymentMethod: String!
        paymentResult: PaymentResult!
        totalPrice: Float!
    }

    type Query {
        allItems: [Item!]!
        allOrders: [Order!]!
        findItemById(id: ID!): Item
        findUserById(id: ID!): User
        findOrderById(id: ID!): Order
        me: User
    }

    """
    Input types for mutations
    """
    input ItemInput {
        listing_title: String!
        listing_description: String!
        listing_price: Float!
        listing_image: String!
        listing_category: Categories!
        listing_quantity: Int!
        quantity: Int!
    }

    input ShippingAddressInput {
        address: String!
        city: String!
        postalCode: String!
        country: String!
    }

    input PaymentResultInput {
        id: String!
        paymentStatus: String!
        paymentTime: String!
    }


    type Mutation {
        addItem(
            listing_title: String!
            listing_description: String!
            listing_price: Float!
            listing_image: String!
            listing_category: Categories!
            listing_quantity: Int! 
        ): Item

        deleteItem(id: ID!): Item

        addOrder(
            user: String!
            items: [ItemInput!]!
            shippingAddress: ShippingAddressInput!
            paymentMethod: String!
            paymentResult: PaymentResultInput!
            totalPrice: Float!
        ): Order

        createUser(
            name: String!
            password: String!
        ): User

        login(
            name: String!
            password: String!
        ): Token

        addUser(
            name: String!
            password: String!
        ): User

        deleteUser(id: ID!): User
    }
`
export default typeDefs
