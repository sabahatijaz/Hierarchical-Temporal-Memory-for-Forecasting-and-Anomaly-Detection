import datetime
import os
import threading
from decimal import Decimal
import shutil
import random
from nupic.frameworks.opf.prediction_metrics_manager import MetricsManager
# from main import HTMInstanceHandler
from HTMInstances import HTMInstances
# HTMInstanceHandler = HTMInstances()
from opf.clients.hotgym.prediction.one_gym.HTMHandler import HTM_Handler
from opf.clients.hotgym.prediction.one_gym.scrapp import ItemsCount
import numpy as np
DATE_FORMAT = "%m/%d/%Y %H:%M"

class HtmWrapp:
    # def __init__(self):

    def GetPrediction(self, HTMInstanceHandler,CategoryID, Input, IsSwaming, Steps, Duration,
                      IsPersistence,Spike):

        # Input[Input.keys()[0]] = datetime.datetime.strptime(Input[Input.keys()[0]], DATE_FORMAT)
        # Input[Input.keys()[-1]] = float(Input[Input.keys()[-1]])
        try:
            InstanceStatus,Instance = HTMInstanceHandler.GetInstance(CategoryID)
        except Exception as e:
            print "HTMInstance is not being fetched because "
            raise e
        finally:
            print "Instance Fetched"
#######################################################################################################################################################

#######################################################################################################################################################

######################################Htm instance and file doesnot exist#################################################################################################################
        if InstanceStatus==2:    #Htm instance and file doesnot exist
            print "Creating New!!!!!!!!!!!!!!!!!!!!!!!!!!!!11"
            Instance = HTM_Handler()
            try:
                model = Instance.CreateModel(CategoryID, Input, Steps, Duration,IsPersistence)
            except Exception as e:
                print "Error in model creation because "
                raise e

            Instance.metricsManager = MetricsManager(Instance._METRIC_SPECS, Instance.model.getFieldInfo(),
                                                     Instance.model.getInferenceType())
            result = Instance.handle(Input,CategoryID,IsPersistence)
            result.metrics = Instance.metricsManager.update(result)
            try:
                HTMInstanceHandler.AddInstance(CategoryID, Instance, Input)
            except Exception as e:
                print "Error in adding newly created instance to HTM instances Dictionary because "
                raise e
            bestPredictions = result.inferences['multiStepBestPredictions']
            anomalyScore = result.inferences["anomalyScore"]
            # print type(anomalyScore)
            # print bestPredictions
            allPredictions = result.inferences['multiStepPredictions']

            oneStep = bestPredictions[1]
            nthStep = bestPredictions[int(Steps)]
            if oneStep < 100 and nthStep < 100:
                if oneStep == 0.0:
                    print("adjusting")
                    oneStep = abs(Input[Input.keys()[-1]] - 0.04)
                if nthStep == 0.0:
                    nthStep = abs(Input[Input.keys()[-1]] - 0.04)
            else:
                if oneStep == 0:
                    oneStep = Input[Input.keys()[-1]] - 40
                if nthStep == 0:
                    nthStep = Input[Input.keys()[-1]] - 40
            # oneStepConfidence = allPredictions[1][oneStep]
            # nthStepConfidence = allPredictions[int(Steps)][nthStep]
            # result1 = (oneStep, oneStepConfidence * 100,
            #           nthStep, nthStepConfidence * 100)
            # print "1-step: {:16} ({:4.4}%)\t 5-step: {:16} ({:4.4}%)".format(*result1)
            try:
                SwarmingStatus = HTMInstanceHandler.IsSwarmingDataReady(CategoryID)
            except Exception as e:
                print "Error in getting swarming status because "
                raise e

            if Instance.SwarmThread==0:   #0 represent that swarming is not active and will check if it is applicable
                if SwarmingStatus and IsSwaming:  #if applicable start swarming and change SwarnigThread to 1 to represent it is in process
                    try:
                        Instance.threadObj = threading.Thread(target=Instance.RunSwarm, args=(Input, CategoryID, Steps))
                    except Exception as e:
                        print "Error in Creating Swarming Thread because "
                        raise e

                    Instance.threadObj.setName(CategoryID)
                    Instance.threadObj.start()
                    Instance.setThreadID(Instance.threadObj.native_id)
                    HTMInstanceHandler.SwarmingStatus = "Swarming in Process!!!"
                    Instance.SwarmThread=1
                else:
                    HTMInstanceHandler.SwarmingStatus = "Swarming Records Not Enough!!!!!"
            elif Instance.SwarmThread==1:  #1 represent swarmin thread is active, it will chack if the thread has
                # #finished execution successfully...
                # if thread is complete...  it will change the status of SwarmThread
                # to 2... to represent that now recreate the model with swarmed parameters
                if Instance.threadObj.isAlive():
                    Instance.SwarmThread = 1
                else:
                    paramsName = "%s.py" % CategoryID
                    # outDir = os.path.join(os.getcwd(), 'model_params')
                    ModelParamsFileName = os.path.join(os.getcwd(), 'model_params', paramsName)
                    if os.path.isfile(ModelParamsFileName):#it will check if the  parameters file is written on not
                        Instance.SwarmThread=2
            else:       #it will recreate the model with #swarmed parameters and will change the swarming thread
                # to 0 for other cycle to continue
                # read the parameters from file
                paramsName = "%s.py" % CategoryID
                # outDir = os.path.join(os.getcwd(), 'model_params')
                ModelParamsFileName = os.path.join(os.getcwd(), 'model_params', paramsName)
                ModelParams = Instance.getModelParamsFromName(ModelParamsFileName,CategoryID)
                Instance.CreateModelFromPram(ModelParams,CategoryID, Input, Steps, Duration, IsPersistence)
                Instance.SwarmThread = 0
            if Spike=="":

                Instance.MVA.append(Input[Input.keys()[-1]])
                response = {"timeStamp": Input[Input.keys()[0]], "InValue": Input[Input.keys()[-1]], "OneStep": oneStep, "nthStep": nthStep,
                            "SwarmingStatus": HTMInstanceHandler.SwarmingStatus,"Spike":"","AnomalyScore":float(anomalyScore)}
            elif Spike=="MV":
                Instance.MVA.append(Input[Input.keys()[-1]])
                try:
                    MV=Instance.moving_average(Instance.MVA,3)
                except Exception as e:
                    print "Error in getting Moving Average because "
                    raise e

                if len(MV>2):
                    if Input[Input.keys()[-1]]>=MV[0]:
                        sp=True
                    else:
                        sp=False
                    response = {"timeStamp": Input[Input.keys()[0]], "InValue": Input[Input.keys()[-1]], "OneStep": oneStep, "nthStep": nthStep,
                                "SwarmingStatus": HTMInstanceHandler.SwarmingStatus, "Spike": sp,"AnomalyScore":float(anomalyScore)}
                else:
                    if Input[Input.keys()[-1]]>=MV:
                        sp=True
                    else:
                        sp=False
                    response = {"timeStamp": Input[Input.keys()[0]], "InValue": Input[Input.keys()[-1]], "OneStep": oneStep, "nthStep": nthStep,
                                "SwarmingStatus": HTMInstanceHandler.SwarmingStatus, "Spike": sp,"AnomalyScore":float(anomalyScore)}
            else:#ft:20
                Instance.MVA.append(Input[Input.keys()[-1]])
                ft=int(Spike[3:])
                if Input[Input.keys()[-1]] >= ft:
                    sp = True
                else:
                    sp = False
                response = {"timeStamp": Input[Input.keys()[0]], "InValue": Input[Input.keys()[-1]], "OneStep": oneStep, "nthStep": nthStep,
                            "SwarmingStatus": HTMInstanceHandler.SwarmingStatus, "Spike": sp,"AnomalyScore":float(anomalyScore)}

            Instance.LastFifteen.append(response)
            if len(Instance.LastFifteen)>=15:
                Instance.LastFifteen.pop(0)
            try:
                HTMInstanceHandler.Instances[CategoryID] = Instance
            except Exception as e:
                print "Error in Updating Instance because "
                raise e

            return response
#######################################################################################################################################################

##############################file exist but not instance#########################################################################################################################

        elif InstanceStatus == 1:   #file exist but not instance
            Instance = HTM_Handler()
            try:
                model = Instance.recreateInstance(CategoryID,CategoryID, Input, Steps, Duration, IsPersistence)
            except Exception as e:
                print "Error in recreating Model because "
                raise e


            Instance.metricsManager = MetricsManager(Instance._METRIC_SPECS, Instance.model.getFieldInfo(),
                                                     Instance.model.getInferenceType())
            result = Instance.handle(Input,CategoryID,IsPersistence)
            result.metrics = Instance.metricsManager.update(result)
            try:
                HTMInstanceHandler.AddInstance(CategoryID, Instance, Input)
            except Exception as e:
                print "Error in Adding Instance to Instance Handler because "
                raise e

            bestPredictions = result.inferences['multiStepBestPredictions']
            anomalyScore = result.inferences["anomalyScore"]
            # print type(anomalyScore)
            # allPredictions = result.inferences['multiStepPredictions']
            oneStep = bestPredictions[1]
            nthStep = bestPredictions[int(Steps)]
            if oneStep < 100 and nthStep < 100:
                if oneStep == 0.0:
                    print("adjusting")
                    oneStep = abs(Input[Input.keys()[-1]] - 0.04)
                if nthStep == 0.0:
                    nthStep = abs(Input[Input.keys()[-1]] - 0.04)
            else:
                if oneStep == 0:
                    oneStep = Input[Input.keys()[-1]] - 40
                if nthStep == 0:
                    nthStep = Input[Input.keys()[-1]] - 40
            try:
                SwarmingStatus = HTMInstanceHandler.IsSwarmingDataReady(CategoryID)
            except Exception as e:
                print "Error in Getting Swarming Status because "
                raise e


            if Instance.SwarmThread == 0:  # 0 represent that swarming is not active and will check if it is applicable
                if SwarmingStatus and IsSwaming:  # if applicable start swarming and change SwarnigThread to 1 to represent it is in process
                    try:
                        Instance.threadObj = threading.Thread(target=Instance.RunSwarm,
                                                              args=(Input, CategoryID, Steps))
                    except Exception as e:
                        print "Error in Creating Swarming Thread because "
                        raise e

                    Instance.threadObj.setName(CategoryID)
                    Instance.threadObj.start()
                    Instance.setThreadID(Instance.threadObj.native_id)
                    HTMInstanceHandler.SwarmingStatus = "Swarming in Process!!!"
                    Instance.SwarmThread = 1
                else:
                    HTMInstanceHandler.SwarmingStatus = "Swarming Records Not Enough!!!!!"
            elif Instance.SwarmThread == 1:  # 1 represent swarmin thread is active, it will chack if the thread has
                # #finished execution successfully...
                # if thread is complete...  it will change the status of SwarmThread
                # to 2... to represent that now recreate the model with swarmed parameters
                if Instance.threadObj.isAlive():
                    Instance.SwarmThread = 1
                else:
                    paramsName = "%s.py" % CategoryID
                    # outDir = os.path.join(os.getcwd(), 'model_params')
                    ModelParamsFileName = os.path.join(os.getcwd(), 'model_params', paramsName)
                    if os.path.isfile(ModelParamsFileName):  # it will check if the  parameters file is written on not
                        Instance.SwarmThread = 2
            else:  # it will recreate the model with #swarmed parameters and will change the swarming thread
                # to 0 for other cycle to continue
                # read the parameters from file
                paramsName = "%s.py" % CategoryID
                # outDir = os.path.join(os.getcwd(), 'model_params')
                ModelParamsFileName = os.path.join(os.getcwd(), 'model_params', paramsName)
                ModelParams = Instance.getModelParamsFromName(ModelParamsFileName,CategoryID)
                Instance.CreateModelFromPram(ModelParams, CategoryID, Input, Steps, Duration, IsPersistence)
                Instance.SwarmThread = 0
            # print "input " + str(timestamp) + " " + str(consumption)
            # print "one step " + str(oneStep)
            # print "five step " + str(nthStep)
            # anomalyScore = result.inferences["anomalyScore"]
            # print anomalyScore
            if Spike == "":
                Instance.MVA.append(Input[Input.keys()[-1]])
                response = {"timeStamp": Input[Input.keys()[0]], "InValue": Input[Input.keys()[-1]], "OneStep": oneStep, "nthStep": nthStep,
                            "SwarmingStatus": HTMInstanceHandler.SwarmingStatus,"Spike":"","AnomalyScore":float(anomalyScore)}
            elif Spike == "MV":
                Instance.MVA.append(Input[Input.keys()[-1]])
                try:
                    MV=Instance.moving_average(Instance.MVA,3)
                except Exception as e:
                    print "Error in Getting Moving Average because "
                    raise e

                # print(MV)
                if len(MV > 2):
                    if Input[Input.keys()[-1]] >= MV[0]:
                        sp = True
                    else:
                        sp = False
                    response = {"timeStamp": Input[Input.keys()[0]], "InValue": Input[Input.keys()[-1]],
                                "OneStep": oneStep, "nthStep": nthStep,
                                "SwarmingStatus": HTMInstanceHandler.SwarmingStatus, "Spike": sp,
                                "AnomalyScore": float(anomalyScore)}
                else:
                    if Input[Input.keys()[-1]] >= MV:
                        sp = True
                    else:
                        sp = False
                    response = {"timeStamp": Input[Input.keys()[0]], "InValue": Input[Input.keys()[-1]],
                                "OneStep": oneStep, "nthStep": nthStep,
                                "SwarmingStatus": HTMInstanceHandler.SwarmingStatus, "Spike": sp,
                                "AnomalyScore": float(anomalyScore)}
            else:
                ft = int(Spike[3:])
                Instance.MVA.append(Input[Input.keys()[-1]])
                if Input[Input.keys()[-1]] >= ft:
                    sp = True
                else:
                    sp = False
                response = {"timeStamp": Input[Input.keys()[0]], "InValue": Input[Input.keys()[-1]], "OneStep": oneStep, "nthStep": nthStep,
                            "SwarmingStatus": HTMInstanceHandler.SwarmingStatus, "Spike": sp,"AnomalyScore":float(anomalyScore)}
            # print response
            Instance.LastFifteen.append(response)
            if len(Instance.LastFifteen)>=15:
                Instance.LastFifteen.pop(0)
            try:
                HTMInstanceHandler.Instances[CategoryID] = Instance
            except Exception as e:
                print "Error in Updating Instance because "
                raise e
            return response

#######################################################################################################################################################

#################################Instance Exists######################################################################################################################

        else:
            # print "Using!!!!!!!!!!!!!"
            # Instance = InstanceStatus
            result = Instance.handle(Input,CategoryID,IsPersistence)
            result.metrics = Instance.metricsManager.update(result)

            bestPredictions = result.inferences['multiStepBestPredictions']
            anomalyScore = result.inferences["anomalyScore"]
            # print type(anomalyScore)
            allPredictions = result.inferences['multiStepPredictions']
            # oneStep = bestPredictions[1]
            # nthStep = bestPredictions[int(Steps)]
            oneStep = bestPredictions[1]
            nthStep = bestPredictions[int(Steps)]
            if oneStep < 100 and nthStep < 100:
                if oneStep == 0.0:
                    print("adjusting")
                    oneStep = abs(Input[Input.keys()[-1]] - 0.04)
                if nthStep == 0.0:
                    nthStep = abs(Input[Input.keys()[-1]] - 0.04)
            else:
                if oneStep == 0.0:
                    oneStep = Input[Input.keys()[-1]] - 40
                if nthStep == 0.0:
                    nthStep = Input[Input.keys()[-1]] - 40
            # oneStepConfidence = allPredictions[1][oneStep]
            # nthStepConfidence = allPredictions[int(Steps)][nthStep]
            # result1 = (oneStep, oneStepConfidence * 100,
            #            nthStep, nthStepConfidence * 100)
            # print "1-step: {:16} ({:4.4}%)\t 5-step: {:16} ({:4.4}%)".format(*result1)
            SwarmingStatus = HTMInstanceHandler.IsSwarmingDataReady(CategoryID)
            try:
                HTMInstanceHandler.AddRecords(CategoryID,  Input)
            except Exception as e:
                print "Error in Adding Record to CSV File because "
                raise e

            if Instance.SwarmThread == 0:  # 0ng is not active and will check if it is applicable
                if SwarmingStatus and IsSwaming:  # if applic represent that swarmiable start swarming and change SwarnigThread to 1 to represent it is in process
                    try:
                        Instance.threadObj = threading.Thread(target=Instance.RunSwarm,
                                                              args=(Input, CategoryID, Steps))
                    except Exception as e:
                        print "Error in Creating Thread because "
                        raise e

                    Instance.threadObj.setName(CategoryID)
                    Instance.threadObj.start()
                    # Instance.setThreadID(Instance.threadObj.native_id)
                    HTMInstanceHandler.SwarmingStatus = "Swarming in Process!!!"
                    Instance.SwarmThread = 1
                else:
                    HTMInstanceHandler.SwarmingStatus = "Swarming Records Not Enough!!!!!"
            elif Instance.SwarmThread == 1:  # 1 represent swarmin thread is active, it will chack if the thread has
                # #finished execution successfully...
                # if thread is complete...  it will change the status of SwarmThread
                # to 2... to represent that now recreate the model with swarmed parameters
                if Instance.threadObj.isAlive():
                    Instance.SwarmThread = 1
                else:
                    paramsName = "%s.py" % CategoryID
                    # outDir = os.path.join(os.getcwd(), 'model_params')
                    ModelParamsFileName = os.path.join(os.getcwd(), 'model_params', paramsName)
                    if os.path.isfile(ModelParamsFileName):  # it will check if the  parameters file is written on not
                        Instance.SwarmThread = 2
            else:  # it will recreate the model with #swarmed parameters and will change the swarming thread
                # to 0 for other cycle to continue
                # read the parameters from file
                paramsName = "%s.py" % CategoryID
                # outDir = os.path.join(os.getcwd(), 'model_params')
                ModelParamsFileName = os.path.join(os.getcwd(), 'model_params', paramsName)
                ModelParams = Instance.getModelParamsFromName(ModelParamsFileName,CategoryID)
                Instance.CreateModelFromPram(ModelParams, CategoryID, Input, Steps, Duration, IsPersistence)
                Instance.SwarmThread = 0

            if Spike == "":
                Instance.MVA.append(Input[Input.keys()[-1]])
                response = {"timeStamp": Input[Input.keys()[0]], "InValue": Input[Input.keys()[-1]], "OneStep": oneStep, "nthStep": nthStep,
                            "SwarmingStatus": HTMInstanceHandler.SwarmingStatus,"Spike":"","AnomalyScore":float(anomalyScore)}
            elif Spike == "MV":
                Instance.MVA.append(Input[Input.keys()[-1]])
                try:
                    MV=Instance.moving_average(Instance.MVA,3)
                except Exception as e:
                    print "Error in Getting Moving Average because "
                    raise e

                # print(MV)
                if len(MV > 2):
                    if Input[Input.keys()[-1]] >= MV[0]:
                        sp = True
                    else:
                        sp = False
                    response = {"timeStamp": Input[Input.keys()[0]], "InValue": Input[Input.keys()[-1]],
                                "OneStep": oneStep, "nthStep": nthStep,
                                "SwarmingStatus": HTMInstanceHandler.SwarmingStatus, "Spike": sp,
                                "AnomalyScore": float(anomalyScore)}
                else:
                    if Input[Input.keys()[-1]] >= MV:
                        sp = True
                    else:
                        sp = False
                    response = {"timeStamp": Input[Input.keys()[0]], "InValue": Input[Input.keys()[-1]],
                                "OneStep": oneStep, "nthStep": nthStep,
                                "SwarmingStatus": HTMInstanceHandler.SwarmingStatus, "Spike": sp,
                                "AnomalyScore": float(anomalyScore)}
            else:
                ft = int(Spike[3:])
                Instance.MVA.append(Input[Input.keys()[-1]])
                if Input[Input.keys()[-1]] >= ft:
                    sp = True
                else:
                    sp = False
                response = {"timeStamp": Input[Input.keys()[0]], "InValue": Input[Input.keys()[-1]], "OneStep": oneStep, "nthStep": nthStep,
                            "SwarmingStatus": HTMInstanceHandler.SwarmingStatus, "Spike": sp,"AnomalyScore":float(anomalyScore)}
            # print response
            Instance.LastFifteen.append(response)
            if len(Instance.LastFifteen)>=15:
                Instance.LastFifteen.pop(0)
            try:
                HTMInstanceHandler.Instances[CategoryID] = Instance
            except Exception as e:
                print "Error in Updating Instance because "
                raise e
#######################################################################################################################################################

#######################################################################################################################################################

            return response
    def GetLastFifteen(self,HTMInstanceHandler,CategoryID):
        InstanceStatus, Instance = HTMInstanceHandler.GetInstance(CategoryID)
        try:
            if InstanceStatus!=0:
                return []
            else:
                return Instance.LastFifteen
        except Exception as err:
            print "Error in getting last fifteen from backend"
            print err

    def removeAllData(self,CategoryID):
        path = os.path.join(os.getcwd(), 'Data', CategoryID)
        if os.path.isdir(path):
            try:
                shutil.rmtree(path)
            except Exception as err:
                print "Error in Removing Data Files"
                print err
            return "Files Removed"
        else:
            return "Files Doesnot Exist"
    def DelHTM(self,HTMInstanceHandler,CategoryID):
        HTMInstanceHandler.DeleteHTM(CategoryID=CategoryID)
    # Deleting (Calling destructor)
    # def __del__(self):
    #     print('Destructor called, HTM deleted.')
