class CreateTracks < ActiveRecord::Migration[5.2]
  def change
    create_table :tracks do |t|
      t.string :name
      t.string :artist
      t.string :album
      t.string :lookup_id
      t.float :danceability
      t.float :acousticness
      t.float :energy
      t.float :valence
      t.timestamps
    end
  end
end
