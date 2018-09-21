require 'curb'
require 'json'
require 'date'

desc "collect daily top 50 track features for countries in ../playlists.json"
task :report_data => :environment do

  $total_tracks_recorded = 0
  $total_countries_recorded = 0

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
  def analyze_playlist(playlist)
    token = get_token
    total_danceability = 0
    total_acousticness = 0
    total_energy = 0
    total_valence = 0
    d_count = 0
    a_count = 0
    e_count = 0
    v_count = 0
    data = {}

    playlist.each do |track|
      id = track['track']['id']
      http = Curl.get("https://api.spotify.com/v1/audio-features/#{id}") do |http|
        http.headers['Authorization'] = "Bearer #{token}"
      end
      track_info = JSON.parse(http.body_str)

      record_track(track_info['id'], track['track']['name'], track['track']['artists'][0]['name'],
        track['track']['album']['name'], track_info['danceability'], track_info['acousticness'],
        track_info['energy'], track_info['valence'])

      unless track_info['danceability'].nil?
        total_danceability += track_info['danceability']
        d_count += 1
      end
      unless track_info['acousticness'].nil?
        total_acousticness += track_info['acousticness']
        a_count += 1
      end
      unless track_info['energy'].nil?
        total_energy += track_info['energy']
        e_count += 1
      end
      unless track_info['valence'].nil?
        total_valence += track_info['valence']
        v_count += 1
      end
    end

    data[:danceability] = (total_danceability / d_count)
    data[:acousticness] = (total_acousticness / a_count)
    data[:energy] = (total_energy / e_count)
    data[:valence] = (total_valence / v_count)

    puts "Total d: #{d_count}"
    puts "Total d: #{a_count}"
    puts "Total d: #{e_count}"
    puts "Total d: #{v_count}"
    data
  end

  def report_data
    file = File.join(File.dirname(__FILE__), "../playlists.json")

    countries = File.read(file)
    country_data = JSON.parse(countries)['countries']

    country_data.each do |country|
      data = analyze_playlist(get_playlist(country['id']))
      Country.create(name: country['name'], lookup_id: country['id'], avg_danceability: data[:danceability], avg_acousticness: data[:acousticness], avg_energy: data[:energy], avg_valence: data[:valence], date: Date.today)
      puts "The Danceability of the Top 50 tracks in #{country['name']}: #{data[:danceability]}"
      puts "The Acousticness of the Top 50 tracks in #{country['name']}: #{data[:acousticness]}"
      puts "The Energy of the Top 50 tracks in #{country['name']}: #{data[:energy]}"
      puts "The Valence of the Top 50 tracks in #{country['name']}: #{data[:valence]}"
      # puts "Total tracks recorded in #{country['name']}: #{total_tracks_recorded}"
      sleep(30)
    end
    # puts "Total number of countries successfully stored today: #{total_countries_recorded}"
    puts "rake task successful"
  end

  def record_track(id, name, artist, album, d, a, e, v)
    track = Track.find_by(lookup_id: id)
    if track.nil?
      Track.create(lookup_id: id, name: name, artist: artist, album: album, danceability: d,
        acousticness: a, energy: e, valence: v)
    end
  end

  report_data
end
