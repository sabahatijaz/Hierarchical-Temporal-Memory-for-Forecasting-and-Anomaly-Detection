import decimal
import os

import pickle
import cPickle as pickle
import time
from StringIO import StringIO
import pandas as pd
from nupic.algorithms.spatial_pooler import SpatialPooler
from nupic.frameworks.opf.prediction_metrics_manager import MetricsManager

from swarm import SwarmHandler
from scrapp import ItemsCount
import importlib
import json
import sys
import numpy as np
import csv
import datetime
from nupic.data.inference_shifter import InferenceShifter
from nupic.frameworks.opf.metrics import MetricSpec
from nupic.frameworks.opf.model_factory import ModelFactory

class HTM_Handler():
    '''
    This Class creates HTM instaces, Swarms on Recors, Recreates HTM Instance, Persist HTM Instance
    ,Calculates Moving Average. It is responsible for all the activities related to specific HTM instance
    '''
    def __init__(self):
        DESCRIPTION = (
            "Starts a NuPIC model from the model params returned by the swarm\n"
            "and pushes each line of input from the gym into the model. Results\n"
            "are written to an output file (default) or plotted dynamically if\n"
            "the --plot option is specified.\n"
            "NOTE: You must run ./swarm.py before this, because model parameters\n"
            "are required to run NuPIC.\n"
        )
        self.MVA = []
        self.LastFifteen=[]
        self.SwarmThread=0
        self.ThreadID=""
        self.threadObj=""
        # self.GYM_NAME = "rec-center-hourly"  # or use "rec-center-every-15m-large"
        self.DATE_FORMAT = "%Y/%m/%d %H:%M:%S"

        self._METRIC_SPECS = None
        self.model = None
        self.shifter = InferenceShifter()
        # self.output = nupic_output.NuPICFileOutput(["HTM"])


    def moving_average(self,a, n):
        '''

        Args:
            a: array of recors
            n: moving window size

        Returns:

        '''
        ret = np.cumsum(a, dtype=float)
        ret[n:] = ret[n:] - ret[:-n]
        return ret[n - 1:] / n



    def createSwarmDescrition(self,mydict,CategoryID,Steps):
        '''

        Args:
            mydict: dictionary of input data with fiels names and data to recognize type
            CategoryID: HTM ID to read csv file where records are saved for swarming
            Steps: Number of steps to predict

        Returns:
            SWARM_DESCRIPTION
        '''
        SWARM_DESCRIPTION = {
            "includedFields": [

            ],
            "streamDef": {
                "info": str(mydict.keys()[-1]),
                "version": 1,
                "streams": [
                    {
                        "info": "Rec Center",
                        "source": "file://Data/"+CategoryID+"/"+CategoryID+'.csv',
                        "columns": [
                            "*"
                        ]
                    }
                ]
            },

            "inferenceType": "TemporalAnomaly",
            "inferenceArgs": {
                "predictionSteps": [
                    1,int(Steps)#"{0}".format(int(Steps))
                ],
                "predictedField": str(mydict.keys()[-1])
            },
            "iterationCount": -1,
            "swarmSize": "medium"
        }


        for key, value in mydict.items():
            data = {}
            data['fieldName'] = key
            if isinstance(value, (float, int)):
                # if type(value) == int or type(value) == float or type(value) == decimal:
                data['fieldType'] = "float"
            else:
                data['fieldType'] = "datetime"
            SWARM_DESCRIPTION['includedFields'].append(data)
        # print SWARM_DESCRIPTION
        return SWARM_DESCRIPTION



    def createParams(self, mydict, Steps, Duration):  # return parameters
        '''
        Created Custom Model Parameters
        Args:
            mydict: dictionary of input data with fiels names and data to recognize type
            Steps: Number of steps to predict
            Duration: time after that next prediction will be taken

        Returns:

        '''
        keys = list(mydict.keys())
        MODEL_PARAMS = \
            {"aggregationInfo": {"days": 0,
                                 "fields": [],
                                 "hours": 0,
                                 "microseconds": 0,
                                 "milliseconds": 0,
                                 "minutes": 0,
                                 "months": 0,
                                 "seconds": 0,
                                 "weeks": 0,
                                 "years": 0},
             "model": "HTMPrediction",
             "modelParams": {"anomalyParams": {u"anomalyCacheRecords": None,
                                               u"autoDetectThreshold": None,
                                               u"autoDetectWaitRecords": None},
                             "clParams": {"alpha": 0.06952543555546582,
                                          "regionName": "SDRClassifierRegion",
                                          "steps": "1,{0}".format(int(Steps)),  # int(Steps),
                                          "verbosity": 0},
                             "inferenceType": "TemporalAnomaly",  # "TemporalMultiStepTemporalAnomaly",
                             # "sensorParams": { "encoders": { "_classifierInput": { "classifierOnly": True,
                             #                                             "clipInput": True,
                             #                                             "fieldname": "kw_energy_consumption",
                             #                                             "maxval": 53.0,
                             #                                             "minval": 0.0,
                             #                                             "n": 454,
                             #                                             "name": "_classifierInput",
                             #                                             "type": "ScalarEncoder",
                             #                                             "w": 21},
                             #                       u"kw_energy_consumption": { "clipInput": True,
                             #                                                   "fieldname": "kw_energy_consumption",
                             #                                                   "maxval": 53.0,
                             #                                                   "minval": 0.0,
                             #                                                   "n": 461,
                             #                                                 "name": "kw_energy_consumption",
                             #                                                   "type": "ScalarEncoder",
                             #                                                   "w": 21},
                             #                       u"timestamp_dayOfWeek": None,
                             #                       u"timestamp_timeOfDay": { "fieldname": "timestamp",
                             #                                                 "name": "timestamp",
                             #                                                 "timeOfDay": ( 21,
                             #                                                                0.7107389736591294),
                             #                                                 "type": "DateEncoder"},
                             #                       u"timestamp_weekend": None},
                             #         "sensorAutoReset": None,
                             #         "verbosity": 0},
                             "spEnable": True,
                             "spParams": {"boostStrength": 0.0,
                                          "columnCount": 2048,
                                          "globalInhibition": 1,
                                          "inputWidth": 0,
                                          "numActiveColumnsPerInhArea": 40,
                                          "potentialPct": 0.8,
                                          "seed": 1956,
                                          "spVerbosity": 0,
                                          "spatialImp": "cpp",
                                          "synPermActiveInc": 0.05,
                                          "synPermConnected": 0.1,
                                          "synPermInactiveDec": 0.0054110835959648215},
                             "tmEnable": True,
                             "tmParams": {"activationThreshold": 15,
                                          "cellsPerColumn": 32,
                                          "columnCount": 2048,
                                          "globalDecay": 0.0,
                                          "initialPerm": 0.21,
                                          "inputWidth": 2048,
                                          "maxAge": 0,
                                          "maxSegmentsPerCell": 128,
                                          "maxSynapsesPerSegment": 32,
                                          "minThreshold": 11,
                                          "newSynapseCount": 20,
                                          "outputType": "normal",
                                          "pamLength": 4,
                                          "permanenceDec": 0.1,
                                          "permanenceInc": 0.1,
                                          "seed": 1960,
                                          "temporalImp": "cpp",
                                          "verbosity": 0},
                             "trainSPNetOnlyIfRequested": False},
             "predictAheadTime": None,
             "version": 1}

        MODEL_PARAMS["modelParams"]["sensorParams"] = {}
        MODEL_PARAMS["modelParams"]["sensorParams"]["sensorAutoReset"] = None
        MODEL_PARAMS["modelParams"]["sensorParams"]["verbosity"] = 0
        MODEL_PARAMS["modelParams"]["sensorParams"]["encoders"] = {}
        MODEL_PARAMS["modelParams"]["sensorParams"]["encoders"]['_classifierInput'] = {}
        MODEL_PARAMS["modelParams"]["sensorParams"]["encoders"]['_classifierInput']['classifierOnly'] = True
        MODEL_PARAMS["modelParams"]["sensorParams"]["encoders"]['_classifierInput']["clipInput"] = True
        MODEL_PARAMS["modelParams"]["sensorParams"]["encoders"]['_classifierInput']["maxval"] = 53.0
        MODEL_PARAMS["modelParams"]["sensorParams"]["encoders"]['_classifierInput']["minval"] = 0.0
        MODEL_PARAMS["modelParams"]["sensorParams"]["encoders"]['_classifierInput']["n"] = 454
        MODEL_PARAMS["modelParams"]["sensorParams"]["encoders"]['_classifierInput']["w"] = 21
        MODEL_PARAMS["modelParams"]["sensorParams"]["encoders"]['_classifierInput']['fieldname'] = '{0}'.format(
            keys[-1])
        MODEL_PARAMS["modelParams"]["sensorParams"]["encoders"]['_classifierInput']['name'] = '_classifierInput'

        if isinstance(mydict[keys[-1]], (float, int)):
            MODEL_PARAMS["modelParams"]["sensorParams"]["encoders"]["_classifierInput"]["type"] = "ScalarEncoder"
        else:
            MODEL_PARAMS["modelParams"]["sensorParams"]["encoders"]["_classifierInput"]["type"] = "DateEncoder"

        MODEL_PARAMS["modelParams"]["sensorParams"]["encoders"][u"timestamp_dayOfWeek"] = None
        MODEL_PARAMS["modelParams"]["sensorParams"]["encoders"][u"timestamp_weekend"] = None
        for key, value in mydict.items():
            if key == keys[-1]:
                MODEL_PARAMS["modelParams"]["sensorParams"]["encoders"][u"{0}".format(key)] = {}
                MODEL_PARAMS["modelParams"]["sensorParams"]["encoders"][u"{0}".format(key)]["fieldname"] = '{0}'.format(
                    key)
                MODEL_PARAMS["modelParams"]["sensorParams"]["encoders"][u"{0}".format(key)]["name"] = '{0}'.format(key)
                if isinstance(value, (float, int)):
                    MODEL_PARAMS["modelParams"]["sensorParams"]["encoders"][u"{0}".format(key)][
                        "type"] = "ScalarEncoder"
                else:
                    MODEL_PARAMS["modelParams"]["sensorParams"]['encoders'][u"{0}".format(key)]["type"] = "DateEncoder"
                MODEL_PARAMS["modelParams"]["sensorParams"]["encoders"][u"{0}".format(key)]["clipInput"] = True
                MODEL_PARAMS["modelParams"]["sensorParams"]["encoders"][u"{0}".format(key)]["maxval"] = 53.0
                MODEL_PARAMS["modelParams"]["sensorParams"]["encoders"][u"{0}".format(key)]["minval"] = 0.01
                MODEL_PARAMS["modelParams"]["sensorParams"]["encoders"][u"{0}".format(key)]["n"] = 454
                MODEL_PARAMS["modelParams"]["sensorParams"]["encoders"][u"{0}".format(key)]["w"] = 21
            else:
                MODEL_PARAMS["modelParams"]["sensorParams"]["encoders"][u"{0}".format(key)] = {}
                MODEL_PARAMS["modelParams"]["sensorParams"]["encoders"][u"{0}".format(key)]["fieldname"] = '{0}'.format(
                    key)
                MODEL_PARAMS["modelParams"]["sensorParams"]["encoders"][u"{0}".format(key)]["name"] = '{0}'.format(key)
                if isinstance(value, (float, int)):
                    MODEL_PARAMS["modelParams"]["sensorParams"]["encoders"][u"{0}".format(key)][
                        "type"] = "ScalarEncoder"
                else:
                    MODEL_PARAMS["modelParams"]["sensorParams"]['encoders'][u"{0}".format(key)]["type"] = "DateEncoder"
        self._METRIC_SPECS=(
            MetricSpec(field=str(mydict.keys()[-1]), metric='multiStep',
                       inferenceElement='multiStepBestPredictions',
                       params={'errorMetric': 'aae', 'window': 1000, 'steps': 1}),
            MetricSpec(field=str(mydict.keys()[-1]), metric='trivial',
                       inferenceElement='prediction',
                       params={'errorMetric': 'aae', 'window': 1000, 'steps': 1}),
            MetricSpec(field=str(mydict.keys()[-1]), metric='multiStep',
                       inferenceElement='multiStepBestPredictions',
                       params={'errorMetric': 'altMAPE', 'window': 1000, 'steps': 1}),
            MetricSpec(field=str(mydict.keys()[-1]), metric='trivial',
                       inferenceElement='prediction',
                       params={'errorMetric': 'altMAPE', 'window': 1000, 'steps': 1}),
        )
        return MODEL_PARAMS




    def CreateModel(self, CategoryID, mydict, Steps, Duration,
                    IsPersistence):
        '''
        it call createparams to create parameters for model
        ## dictionary contains the names of fields and their data types
        Args:
            CategoryID: HTM ID to handle save load if persist true
            mydict: dictionary to create htm parameters
            Steps: utilized in creating parameters
            Duration: utilized in creating parameters
            IsPersistence: if true model will be saved after creation else not

        Returns:

        '''
        try:
            modelParams = self.createParams(mydict, Steps, Duration)  # after creating parameters it will create network.
        except Exception as e:
            print "Error in Creating Model Parameters Because "
            raise e
        try:
            self.model = ModelFactory.create(modelParams)
        except Exception as e:
            print "Error in Creating Model Because "
            raise e

        keys = list(mydict.keys())
        self.model.enableInference({"predictedField": "{0}".format(keys[-1])})
        if IsPersistence:
            path = os.path.join(os.getcwd(), 'Data', str(CategoryID)+'/')
            if not os.path.isdir(path):
                os.mkdir(path)
            savePath = os.path.join(path,str(CategoryID))
            try:
                self.model.save(savePath)
            except Exception as e:
                print "Error in Saving Model Because "
                raise e

        return self.model



    def recreateInstance(self, FileName, CategoryID, mydict, Steps, Duration, IsPersistence):
        '''
        This function recreated htm model
        Args:
            FileName: file to read the records to feed to htm
            CategoryID: HTM ID
            mydict: utilized in creating Model Parameters
            Steps: utilized in creating Model Parameters
            Duration: utilized in creating Model Parameters
            IsPersistence: if true model will be saved after creation else not

        Returns:

        '''
        try:
            modelParams = self.createParams(mydict, Steps,
                                            Duration)  # after creating parameters it will create network.
        except Exception as e:
            print "Error in Creating Model Parameters Because "
            raise e
        try:
            self.model = ModelFactory.create(modelParams)
        except Exception as e:
            print "Error in Creating Model Because "
            raise e
        keys = list(mydict.keys())
        self.model.enableInference({"predictedField": "{0}".format(keys[-1])})
        path = os.path.join(os.getcwd(), 'Data',CategoryID+'/')
        inputFile = os.path.join(path+CategoryID + ".csv")
        try:
            df = pd.read_csv(inputFile,skiprows=[1,2,3])
        except Exception as e:
            print "Error in Reading CSV File Because "
            raise e

        resultcsv = df.to_dict(orient='records')
        i=0
        self.metricsManager = MetricsManager(self._METRIC_SPECS, self.model.getFieldInfo(),
                                                 self.model.getInferenceType())
        for row in resultcsv:
            timestamp = row[row.keys()[0]]
            try:
                print timestamp
                timestamp = timestamp.replace('-', '/')
            except Exception as e:
                print "error in replace "
                print e
            try:
                timestamp = datetime.datetime.strptime(timestamp, self.DATE_FORMAT)
            except Exception as e:
                print "error in date format change "
                print e
            row[row.keys()[0]] = timestamp
            try:
                result = self.handle({str(row.keys()[0]): row[row.keys()[0]],
                                      str(row.keys()[-1]): row[row.keys()[-1]]}, CategoryID, IsPersistence)
                result.metrics = self.metricsManager.update(result)
            except Exception as e:
                print "error in handling"
                print e
        return self.model



    def CreateModelFromPram(self,modelParams,CategoryID, mydict, Steps, Duration,
                    IsPersistence):
        '''
        It will be called after swarming
        Args:
            modelParams: Swarmed parameters to create new model
            CategoryID: HTM ID
            mydict:
            Steps:
            Duration:
            IsPersistence: if true model will be saved after creation else not

        Returns:

        '''
        try:
            self.model = ModelFactory.create(modelParams)
        except Exception as e:
            print "Error in Creating Model from Swarmed parameters Because "
            raise e

        keys = list(mydict.keys())
        self.model.enableInference({"predictedField": "{0}".format(keys[-1])})
        if IsPersistence:
            path = os.path.join(os.getcwd(), 'Data', str(CategoryID) + '/')
            if not os.path.isdir(path):
                os.mkdir(path)
            savePath = os.path.join(path, str(CategoryID))
            try:
                self.model.save(savePath)
            except Exception as e:
                print "Error in Saving Model Created from Swarmed parameters Because "
                raise e



    def getModelParamsFromName(self, gymName,CategoryID):
        '''
        Function to read the newly created htm parameters after swarming from file
        Args:
            gymName: path of file
            CategoryID: HTM ID

        Returns:

        '''
        importName = "Data.%s.%s_model_params" % (
            CategoryID,CategoryID.replace(" ","_").replace("-","_")
        )
        print "Importing model params from %s" % importName
        try:
            importedModelParams = importlib.import_module(importName).MODEL_PARAMS
        except ImportError as err:
            print err
            raise Exception("No model params exist for '%s'. Run swarm first!"
                            % gymName)
        return importedModelParams



    def RunSwarm(self, mydict, CategoryID,Steps):
        '''
        Function to start swarming
        Args:
            mydict: utilized in creating swarm description
            CategoryID:  HTM ID
            Steps: utilized in creating swarm description

        Returns:

        '''
        try:
            SWARMDESCRIPTION=self.createSwarmDescrition(mydict,CategoryID,Steps)
        except Exception as e:
            print "Error in Creating Swarm Description Because "
            raise e

        SH = SwarmHandler()
        try:
            ModelParamsFileName = SH.swarm(CategoryID,CategoryID,SWARMDESCRIPTION)
        except Exception as e:
            print "Error in Swarming Because "
            raise e

        # read the parameters from file
        # time.sleep(2)
        # try:
        #     ModelParams = self.getModelParamsFromName(ModelParamsFileName,CategoryID)
        # except Exception as e:
        #     print "Error in Getting Swarmed Parameters Because "
        #     print e
        # try:
        #     self.model = ModelFactory.create(ModelParams)
        # except Exception as e:
        #     print "Error in Getting Swarmed Parameters Because "
        #     print e
        #
        # keys = list(mydict.keys())
        # self.model.enableInference({"predictedField": "{0}".format(keys[-1])})



    def setThreadID(self,ThreadID):
        self.ThreadID=ThreadID


    def getThreadID(self):
        return self.ThreadID


    # def setThreadObj(self,Threadobj):
    #     self.threadObj=Threadobj


    # def getThreadObj(self):
    #     return self.threadObj


    def handle(self, mydict, CategoryID, IsPersistence):
        '''
        This is the function which passes the input to htm model and gets the predicted output
        Args:
            mydict: data to feed to htm
            CategoryID: HTM ID to save load HTM
            IsPersistence: if persistence true htm will be load and saved before and after using

        Returns:

        '''
        keys = list(mydict)
        if IsPersistence:
            path = os.path.join(os.getcwd(), 'Data', str(CategoryID) + '/')
            if not os.path.isdir(path):
                os.mkdir(path)
            savePath = os.path.join(path, str(CategoryID))
            try:
                self.model = ModelFactory.loadFromCheckpoint(savePath)
            except Exception as e:
                print "Error in Loading Saved Model Because "
                raise e



        for key, value in mydict.items():
            typ = type(value)
            if typ == datetime:
                value = datetime.datetime.strptime(value, self.DATE_FORMAT)

            elif typ == float:
                value = float(value)

            mydict[key] = value
        result = self.model.run(mydict)
        if IsPersistence:
            path = os.path.join(os.getcwd(), 'Data', str(CategoryID) + '/')
            if not os.path.isdir(path):
                os.mkdir(path)
            savePath = os.path.join(path, str(CategoryID))
            try:
                self.model.save(savePath)
            except Exception as e:
                print "Error in Saving Model Because "
                raise e

        return result

# if __name__ == '__main__':
#     test = ItemsCount()
#     htm = HTM_Handler()
#     counter = 0
#     args = sys.argv[1:]
#     if "--plot" in args:
#         plot = True
#     else:
#         plot = False
#     shifter = InferenceShifter()
#     if plot:
#         output = nupic_output.NuPICPlotOutput(["HTMScrapp"])
#     else:
#         output = nupic_output.NuPICFileOutput(["HTMScrapp"])
#     while 1:
#         inputdata = test.scrapp()
#         timestamp,consumption=inputdata.split(',')
#         timestamp = datetime.datetime.strptime(timestamp, htm.DATE_FORMAT)
#         consumption = float(consumption)
#         result = htm.handle({
#             "timestamp": timestamp,
#             "kw_energy_consumption": consumption
#         })
#         result.metrics = htm.metricsManager.update(result)
#
#         if counter % 100 == 0:
#             print "Read %i lines..." % counter
#             print ("After %i records, 1-step altMAPE=%f" % (counter,
#                                                             result.metrics["multiStepBestPredictions:multiStep:"
#                                                                            "errorMetric='altMAPE':steps=1:window=1000:"
#                                                                            "field=kw_energy_consumption"]))
#
#         if plot:
#             result = shifter.shift(result)
#
#         bestPredictions = result.inferences['multiStepBestPredictions']
#         allPredictions = result.inferences['multiStepPredictions']
#         oneStep = bestPredictions[1]
#         fiveStep = bestPredictions[5]
#         print "input " + str(timestamp) + " " + str(consumption)
#         print "one step " + str(oneStep)
#         print "five step " + str(fiveStep)
#         anomalyScore = result.inferences["anomalyScore"]
#         print anomalyScore
#         output.write([timestamp], [consumption], [oneStep])
#
#         if plot and counter % 20 == 0:
#             output.refreshGUI()
#         counter += 1
#     # GYM_NAME = "rec-center-hourly"  # or use "rec-center-every-15m-large" DATA_DIR = "../.."
#     inputData =
#     # "%s/%s.csv" % (DATA_DIR, GYM_NAME.replace(" ", "_"))
#     inputFile = open(
#     # r"D:\Ecologix\FinalHTM\HTMWrapper\opf\clients\hotgym\prediction\one_gym\rec-center-hourly.csv",'r')
#     args =sys.argv[1:]
#     if "--plot" in args:
#        plot = True
#     else: plot =False
#     shifter = InferenceShifter()
#     if plot:
#       output =nupic_output.NuPICPlotOutput(["HTM"])
#     else:
#       output = nupic_output.NuPICFileOutput(["HTM"])
#       csvReader = csv.reader(inputFile) # skip header rows
#       csvReader.next()
#       csvReader.next()
#       csvReader.next()
#       counter = 0
#     # htm=HTM_Handler()
#     for row in csvReader:
#       timestamp = datetime.datetime.strptime(row[0], htm.DATE_FORMAT)
#     # consumption = float(row[1])
#       result = htm.handle(counter,"HTM",{ "timestamp": timestamp,
#     # "kw_energy_consumption": consumption })
#       result.metrics = htm.metricsManager.update(result)
#     #
#     #     if counter % 100 == 0:
#     #         print "Read %i lines..." % counter
#     #         print ("After %i records, 1-step altMAPE=%f" % (counter,
#     #                                                         result.metrics["multiStepBestPredictions:multiStep:"
#     #                                                                        "errorMetric='altMAPE':steps=1:window=1000:"
#     #                                                                        "field=kw_energy_consumption"]))
#     #
#     #     if plot:
#     #         result = shifter.shift(result)
#     #
#     #     bestPredictions = result.inferences['multiStepBestPredictions']
#     #     allPredictions = result.inferences['multiStepPredictions']
#     #     oneStep = bestPredictions[1]
#     #     fiveStep = bestPredictions[5]
#     #     print "input "+str(timestamp)+" "+str(consumption)
#     #     print "one step "+str(oneStep)
#     #     print "five step "+str(fiveStep)
#     #     anomalyScore = result.inferences["anomalyScore"]
#     #     print anomalyScore
#     #     output.write([timestamp], [consumption], [oneStep])
#     #
#     #     if plot and counter % 20 == 0:
#     #         output.refreshGUI()
#     #     counter += 1
#     # inputFile.close()
#     # output.close()
