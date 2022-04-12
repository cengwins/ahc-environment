package broadcastserver

import (
	"fmt"
	"net"
	"os"
)

const MSG_SIZE = 2048

type SocketServerHandler func(*SocketServer, net.Conn)

type SocketServer struct {
	path          string
	broadcastChan chan []byte
	quitChan      chan bool

	connections [100]net.Conn
	counter     int
}

func echoHandler(server *SocketServer, conn net.Conn) {
	defer conn.Close()

	for {
		data := make([]byte, MSG_SIZE)

		_, err := conn.Read(data)
		if err != nil {
			return
		}

		server.broadcastChan <- data
	}
}

func (s *SocketServer) setup(path string) {
	s.path = path
	s.broadcastChan = make(chan []byte)
	s.quitChan = make(chan bool)
	s.counter = 0
}

func (s *SocketServer) serve() {
	connChan := make(chan net.Conn)

	ln, err := net.Listen("unix", s.path)
	if err != nil {
		fmt.Println(err)
		return
	}

	// connection queue
	go func() {
		for {
			select {
			case conn := <-connChan:
				s.connections[s.counter] = conn
				s.counter = s.counter + 1
			case data := <-s.broadcastChan:
				for i := 0; i < s.counter; i = i + 1 {
					s.connections[i].Write(data)
				}
			case <-s.quitChan:
				fmt.Println("Closing AHC Bridge")
				for i := 0; i < s.counter; i = i + 1 {
					s.connections[i].Close()
				}
				ln.Close()
				s.cleanup()
				return
			}
		}
	}()

	fmt.Println("Starting AHC Bridge")

	for {
		conn, err := ln.Accept()
		if err != nil {
			fmt.Println(err)
			return
		}

		go echoHandler(s, conn)
		connChan <- conn
	}
}

func (s *SocketServer) cleanup() {
	os.Remove("/tmp/ahc.sock")
}

func (s *SocketServer) Start() {
	s.cleanup()

	s.setup("/tmp/ahc.sock")

	s.serve()
}

func (s *SocketServer) Stop() {
	s.quitChan <- true
}
