package helper

import (
	"encoding/json"
	"net/http"
)

// JSONResponse sends a JSON response to the client
func JSONResponse(w http.ResponseWriter, statusCode int, data interface{}) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	return json.NewEncoder(w).Encode(data)
}

// ErrorResponse sends an error response to the client
func ErrorResponse(w http.ResponseWriter, statusCode int, message string) error {
	return JSONResponse(w, statusCode, map[string]string{"error": message})
}
