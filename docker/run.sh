echo "running gdcapi"
source /deploy-cache/virtual-envs/gdcapi/bin/activate
cd /var/deploy/gdcapi
GDC_FAKE_AUTH=true GDC_API_PORT=5000 GDC_FAKE_DOWNLOAD=True GDC_ES_HOST=142.1.177.42 GDC_API_HOST=0.0.0.0 ES_CASE_INDEX=case_centric ES_GENE_INDEX=gene_centric ES_SSM_INDEX=ssm_centric ES_SSM_OCC_INDEX=ssm_occurrence_centric GDC_ES_INDEX=gdc_from_graph python run.py