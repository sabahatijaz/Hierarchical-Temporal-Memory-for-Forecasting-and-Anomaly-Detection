# ----------------------------------------------------------------------
# Numenta Platform for Intelligent Computing (NuPIC)
# Copyright (C) 2013, Numenta, Inc.  Unless you have an agreement
# with Numenta, Inc., for a separate license for this software code, the
# following terms and conditions apply:
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero Public License version 3 as
# published by the Free Software Foundation.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
# See the GNU Affero Public License for more details.
#
# You should have received a copy of the GNU Affero Public License
# along with this program.  If not, see http://www.gnu.org/licenses.
#
# http://numenta.org/licenses/
# ----------------------------------------------------------------------
"""
Groups together the code dealing with swarming.
(This is a component of the One Hot Gym Prediction Tutorial.)
"""
import os
import pprint

# add logging to output errors to stdout
import logging
logging.basicConfig()

from nupic.swarming import permutations_runner
# from swarm_description import SWARM_DESCRIPTION

INPUT_FILE = "rec-center-hourly.csv"
DESCRIPTION = (
  "This script runs a swarm on the input data (rec-center-hourly.csv) and\n"
  "creates a model parameters file in the `model_params` directory containing\n"
  "the best model found by the swarm. Dumps a bunch of crud to stdout because\n"
  "that is just what swarming does at this point. You really don't need to\n"
  "pay any attention to it.\n"
  )
#This class will pass the data file for swarming process and will save the parameters in .py file
# in JSON format

class SwarmHandler:
  def modelParamsToString(self,modelParams):
    pp = pprint.PrettyPrinter(indent=2)
    return pp.pformat(modelParams)

  def writeModelParamsToFile(self,modelParams, name, CategoryID):
    # cleanName = name.replace(" ", "_").replace("-", "_")
    # path=os.getcwd()+"ParamsFiles/"
    # paramsName = "%s.py" % CategoryID
    # outDir1 = os.path.join(os.getcwd(), 'swarm')
    # if not os.path.isdir(outDir1):
    #   os.mkdir(outDir1)
    # outDir2 = os.path.join(os.getcwd(), 'swarm', CategoryID)
    # if not os.path.isdir(outDir2):
    #   os.mkdir(outDir2)
    # outDir = os.path.join(os.getcwd(), 'swarm',CategoryID, 'model_params')
    # if not os.path.isdir(outDir):
    #   os.mkdir(outDir)
    # Create an __init__.py so the params are recognized.
    cleanName = name.replace(" ", "_").replace("-", "_")
    paramsName = "%s_model_params.py" % cleanName
    # D:\Ecologix\FinalHTM\HTMWrapper\opf\clients\hotgym\prediction\one_gym\Models
    dir1=os.path.join(os.getcwd(),'Data')
    if not os.path.isdir(dir1):
      os.mkdir(dir1)
    initPath = os.path.join(dir1, '__init__.py')
    open(initPath, 'a').close()
    outDir = os.path.join(os.getcwd(),'Data',CategoryID+"/")
    if not os.path.isdir(outDir):
      os.mkdir(outDir)
    initPath = os.path.join(outDir, '__init__.py')
    open(initPath, 'a').close()
    # outPath = os.path.join(os.getcwd(), 'model_params', paramsName)
    outPath = os.path.join(outDir, paramsName)
    with open(outPath, "wb") as outFile:
      modelParamsString = self.modelParamsToString(modelParams)
      outFile.write("MODEL_PARAMS = \\\n%s" % modelParamsString)
    return outPath

  def swarmForBestModelParams(self,swarmConfig, name,CategoryID, maxWorkers=4):
    outputLabel = name
    WorkDir1=os.path.join(os.getcwd(),'swarm')
    if not os.path.exists(WorkDir1):
      os.mkdir(WorkDir1)
    permWorkDir = os.path.abspath('swarm/'+CategoryID)
    if not os.path.exists(permWorkDir):
      os.mkdir(permWorkDir)
    modelParams = permutations_runner.runWithConfig(
      swarmConfig,
      {"maxWorkers": maxWorkers, "overwrite": True},
      outputLabel=outputLabel,
      outDir=permWorkDir,
      permWorkDir=permWorkDir,
      verbosity=0
    )
    modelParamsFile = self.writeModelParamsToFile(modelParams, name,CategoryID)
    return modelParamsFile

  def printSwarmSizeWarning(self,size):
    if size is "small":
      print "= THIS IS A DEBUG SWARM. DON'T EXPECT YOUR MODEL RESULTS TO BE GOOD."
    elif size is "medium":
      print "= Medium swarm. Sit back and relax, this could take awhile."
    else:
      print "= LARGE SWARM! Might as well load up the Star Wars Trilogy."

  def swarm(self,filePath,CategoryID,SWARM_DESCRIPTION):
    name = os.path.splitext(os.path.basename(filePath))[0]
    print name
    print "================================================="
    print "= Swarming on %s data..." % name
    self.printSwarmSizeWarning(SWARM_DESCRIPTION["swarmSize"])
    print "================================================="
    modelParams = self.swarmForBestModelParams(SWARM_DESCRIPTION, name,CategoryID)
    print "\nWrote the following model param files:"
    print "\t%s" % modelParams
    return modelParams



# if __name__ == "__main__":
#   print DESCRIPTION
#   so=SwarmHandler()
#   so.swarm("6055","6055")
