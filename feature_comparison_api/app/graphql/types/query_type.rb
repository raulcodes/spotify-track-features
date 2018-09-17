require 'graphql'

Types::QueryType = GraphQL::ObjectType.define do
  name "Query"

  field :countries_today, !types[Types::CountryType] do
    resolve -> (obj, args, ctx) {
      Country.where(date: Date.today.to_s)
    }
  end

  field :country_today, !Types::CountryType do
    argument :name, types.String
    resolve -> (obj, args, ctx) {
      Country.find_by(date: Date.today.to_s, name: args[:name])
    }
  end
end
