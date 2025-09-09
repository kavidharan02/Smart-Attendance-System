#!/usr/bin/env python3
"""
Download script for FaceNet model files.
Run this script to download the required model files.
"""

import os
import urllib.request
from pathlib import Path

def download_file(url, filepath):
    """Download a file from URL to filepath"""
    print(f"Downloading {filepath}...")
    urllib.request.urlretrieve(url, filepath)
    print(f"✓ Downloaded {filepath}")

def main():
    # Create models directory
    models_dir = Path("backend/ml/models/20180402-114759")
    models_dir.mkdir(parents=True, exist_ok=True)
    
    # Model files to download (replace with your actual URLs)
    models = {
        "facenet.pb": "https://your-cloud-storage.com/facenet.pb",
        "model-20180402-114759.ckpt-275.data-00000-of-00001": "https://your-cloud-storage.com/model-20180402-114759.ckpt-275.data-00000-of-00001",
        "model-20180402-114759.ckpt-275.index": "https://your-cloud-storage.com/model-20180402-114759.ckpt-275.index",
        "model-20180402-114759.ckpt-275.meta": "https://your-cloud-storage.com/model-20180402-114759.ckpt-275.meta"
    }
    
    print("Downloading FaceNet model files...")
    for filename, url in models.items():
        filepath = models_dir / filename
        if not filepath.exists():
            download_file(url, filepath)
        else:
            print(f"✓ {filename} already exists")
    
    print("\n🎉 All model files downloaded successfully!")
    print("You can now run: python backend/ml/main.py")

if __name__ == "__main__":
    main()