#!/bin/bash

PR_NUM=pr-${1}
echo "Pull Request: " ${PR_NUM}
helm list -n ia | grep ${PR_NUM} | awk '{print $1}' | xargs helm uninstall -n ia
kubectl get deploy -n ia | grep ${PR_NUM} | awk '{print $1}' | xargs kubectl delete deploy -n ia
kubectl get job -n ia | grep ${PR_NUM} | awk '{print $1}' | xargs kubectl delete job -n ia
kubectl get statefulset -n ia | grep ${PR_NUM} | awk '{print $1}' | xargs kubectl delete statefulset -n ia
kubectl get svc -n ia | grep ${PR_NUM} | awk '{print $1}' | xargs kubectl delete svc -n ia
kubectl get po -n ia | grep ${PR_NUM} | awk '{print $1}' | xargs kubectl delete po -n ia
kubectl get secret -n ia | grep ${PR_NUM} | awk '{print $1}' | xargs kubectl delete secret -n ia
kubectl get PodDisruptionBudget -n ia | grep ${PR_NUM} | awk '{print $1}' | xargs kubectl delete PodDisruptionBudget -n ia
kubectl get ing -n ia | grep ${PR_NUM} | awk '{print $1}' | xargs kubectl delete ing -n ia
kubectl get configmaps -n ia | grep ${PR_NUM} | awk '{print $1}' | xargs kubectl delete configmaps -n ia
