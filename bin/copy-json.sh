#!/usr/bin/env bash
mkdir -p target/appeal/json && mkdir -p target/appeal/xlsx && cp definitions/appeal/json/*.json target/appeal/json/ && cp definitions/appeal/env/${CCD_ENV:-dev}/*.json target/appeal/json/

