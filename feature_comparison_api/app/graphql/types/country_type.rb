require 'graphql'

Types::CountryType = GraphQL::ObjectType.define do
  name "Country"

  field :id, types.String
  field :name, types.String
  field :avg_danceability, types.Float
  field :avg_acousticness, types.Float
  field :avg_energy, types.Float
  field :avg_valence, types.Float
end
