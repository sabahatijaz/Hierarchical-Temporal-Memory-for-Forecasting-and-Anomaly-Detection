from nupic.algorithms.spatial_pooler import SpatialPooler
sp1 = SpatialPooler(inputDimensions=(10,), columnDimensions=(10,))
with open("out.tmp", "wb") as f:
  sp1.writeToFile(f)

with open("out.tmp", "rb") as f:
  sp2 = SpatialPooler.readFromFile(f)

print sp1.getColumnDimensions(), sp2.getColumnDimensions()