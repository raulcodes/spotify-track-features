class CreateCountries < ActiveRecord::Migration[5.2]
  def change
    create_table :countries do |t|
      t.string :name
      t.string :lookup_id
      t.float :avg_danceability
      t.float :avg_acousticness
      t.float :avg_energy
      t.float :avg_valence
      t.datetime :date
    end
  end
end
