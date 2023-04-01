import os
from nupic.frameworks.opf.common_models.cluster_params import (
    getScalarMetricWithTimeOfDayAnomalyParams)
from nupic.frameworks.opf.model_factory import ModelFactory

params = getScalarMetricWithTimeOfDayAnomalyParams(
    [0], minVal=0.0, maxVal=100.0)
model1 = ModelFactory.create(modelConfig=params["modelConfig"])

savePath = os.path.join(os.getcwd(), "tmpDir")

# Serialize the SP
# model1.save(savePath)
# print "directory"
print os.getcwd()
# Deserialize to a new SP instance
model2 = ModelFactory.loadFromCheckpoint(savePath)

print model1._getSPRegion().getSelf().getAlgorithmInstance().getColumnDimensions(), \
      model2._getSPRegion().getSelf().getAlgorithmInstance().getColumnDimensions()