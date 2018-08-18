require "socket"

LOGIN_PORT = 6112 # Waddler login port
GAME_PORT = 6113 # Waddler game port
TEST_PORT = LOGIN_PORT # Port to test

if TEST_PORT == LOGIN_PORT # Just something to remind me
	puts "Testing login connection"
elsif TEST_PORT == GAME_PORT
	puts "Testing game connection"
end

s = TCPSocket.new "127.0.0.1", TEST_PORT

s.write "<policy-file-request/>" # The first packet in both login and game, which requests the policy 'file'

while true
    p = gets.strip
    s.write p + "\x00" # Packet delimiter 
end