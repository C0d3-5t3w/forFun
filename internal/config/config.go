package config

import (
	"fmt"
	"os"
	"path/filepath"

	"gopkg.in/yaml.v2"
)

// Config holds application configuration
type Config struct {
	Server struct {
		Port int    `yaml:"port"`
		Host string `yaml:"host"`
	} `yaml:"server"`

	Storage struct {
		Path string `yaml:"path"`
	} `yaml:"storage"`

	Chat struct {
		MaxMessages int `yaml:"maxMessages"`
		MaxLength   int `yaml:"maxLength"`
	} `yaml:"chat"`
}

var cfg Config

// Load loads configuration from file
func Load(path string) error {
	data, err := os.ReadFile(path)
	if err != nil {
		return fmt.Errorf("error reading config file: %w", err)
	}

	err = yaml.Unmarshal(data, &cfg)
	if err != nil {
		return fmt.Errorf("error parsing config file: %w", err)
	}

	// Ensure storage directory exists
	dir := filepath.Dir(cfg.Storage.Path)
	err = os.MkdirAll(dir, 0755)
	if err != nil {
		return fmt.Errorf("failed to create storage directory: %w", err)
	}

	return nil
}

// Get returns the loaded configuration
func Get() Config {
	return cfg
}
