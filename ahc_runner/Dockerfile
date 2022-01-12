FROM golang:1.17-alpine AS builder

WORKDIR /app

COPY go.mod go.sum /app/
RUN go mod download

COPY *.go .

RUN CGO_ENABLED=0 go build -o /ahc_runner


FROM gcr.io/distroless/static

ENV AHC_DATA_VOLUME="/data"

VOLUME [ "/data" ]

COPY --from=builder /ahc_runner /

CMD [ "/ahc_runner" ]
