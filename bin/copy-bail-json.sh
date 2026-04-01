#!/usr/bin/env bash
mkdir -p target/bail/json && mkdir -p target/bail/xlsx && cp definitions/bail/json/*.json target/bail/json/ && cp definitions/bail/env/${CCD_ENV:-dev}/*.json target/bail/json/

