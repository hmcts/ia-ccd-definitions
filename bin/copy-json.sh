#!/usr/bin/env bash

mkdir -p target/appeal/json && mkdir -p target/appeal/xlsx && cp definitions/appeal/json/*.json target/appeal/json/ && cp definitions/appeal/env/${CCD_ENV:-dev}/*.json target/appeal/json/
mkdir -p target/bail/json && mkdir -p target/bail/xlsx && cp definitions/bail/json/*.json target/bail/json/ && cp definitions/bail/env/${CCD_ENV:-dev}/*.json target/bail/json/
