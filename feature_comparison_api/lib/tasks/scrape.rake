require 'curb'
require 'json'
require 'date'

desc "collect daily top 50 track features for countries in ../playlists.json"
task :report_data => :environment do

  def get_token
    basic_auth = "Basic #{ENV['SPOTIFY_CLIENT_TOKEN']}"

    http = Curl.post('https://accounts.spotify.com/api/token', { grant_type: 'client_credentials' }) do |http|
      http.headers['Authorization'] = basic_auth
    end
    JSON.parse(http.body_str)['access_token']
  end

  def get_playlist(id)
    token = get_token
    http = Curl.get("https://api.spotify.com/v1/playlists/#{id}/tracks") do |http|
      http.headers['Authorization'] = "Bearer #{token}"
    end
    JSON.parse(http.body_str)['items']
  end

  # Currently getting danceability
  def get_avg_features(playlist)
    token = get_token
    total_danceability = 0
    total_acousticness = 0
    total_energy = 0
    total_valence = 0
    data = {}

    playlist.each do |track|
      id = track['track']['id']
      http = Curl.get("https://api.spotify.com/v1/audio-features/#{id}") do |http|
        http.headers['Authorization'] = "Bearer #{token}"
      end
      danceability = JSON.parse(http.body_str)['danceability']
      acousticness = JSON.parse(http.body_str)['acousticness']
      energy = JSON.parse(http.body_str)['energy']
      valence = JSON.parse(http.body_str)['valence']

      total_danceability += danceability unless danceability.nil?
      total_acousticness += acousticness unless acousticness.nil?
      total_energy += energy unless energy.nil?
      total_valence += valence unless valence.nil?
    end
    data[:danceability] = (total_danceability / playlist.length)
    data[:acousticness] = (total_acousticness / playlist.length)
    data[:energy] = (total_energy / playlist.length)
    data[:valence] = (total_valence / playlist.length)
    data
  end

  def report_data
    file = File.join(File.dirname(__FILE__), "../playlists.json")

    countries = File.read(file)
    country_data = JSON.parse(countries)['countries']

    country_data.each do |country|
      data = get_avg_features(get_playlist(country['id']))
      Country.create(name: country['name'], lookup_id: country['id'], avg_danceability: data[:danceability],
        avg_acousticness: data[:acousticness], avg_energy: data[:energy], avg_valence: data[:valence], date: Date.today)
      puts "The Danceability of the Top 50 tracks in #{country['name']}: #{data[:danceability]}"
      puts "The Acousticness of the Top 50 tracks in #{country['name']}: #{data[:acousticness]}"
      puts "The Energy of the Top 50 tracks in #{country['name']}: #{data[:energy]}"
      puts "The Valence of the Top 50 tracks in #{country['name']}: #{data[:valence]}"
      sleep(30)
    end
    puts "rake task successful"
  end

  report_data
end

