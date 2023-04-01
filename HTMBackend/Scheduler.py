import csv
import datetime
import json
import math
import random

from nupic.algorithms import anomaly_likelihood

from main import socketio
import apscheduler as apscheduler
import schedule
from flask import jsonify
# from bson import json_util
import numpy as np
import HtmWrap
# from sklearn.metrics import mean_absolute_error
from EbayScrapper.scrapp import ItemsCount
from apscheduler.schedulers.background import BackgroundScheduler
# from wsgi import app  # a Flask, Django, etc. application
from nab.detectors.base import AnomalyDetector
from nab.detectors.numenta.numenta_detector import SPATIAL_TOLERANCE

DATE_FORMAT = "%m/%Y"
DATE_FORMAT2 = "%Y/%m/%d"
DATE_FORMAT3="%d/%m/%Y %M:%S"
# from sklearn.metrics import mean_squared_error
from Connection import Connection


class Scheduler(apscheduler.schedulers.background.BackgroundScheduler):

    def __init__(self):
        super(Scheduler, self).__init__()
        self.scrapp = ItemsCount()
        self.HTMInstanceHandler = None
        self.CategoryID = None
        self.IsSwaming = None
        self.Steps = None
        self.Duration = None
        self.IsPersistence = None
        self.IsDayPersistence=None
        self.spike = None
        self.scheduler = BackgroundScheduler(daemon=True)
        self.db=Connection()
        self.lastfifteen=[]
        self.HTM=HtmWrap.HtmWrapp()
        self.counter=0
        self.counter2=0
        self.Predocted=0
        self.nPredicted=0
        self.ActualArr=[]
        self.PredArr=[]
        self.anomalyLikelihood = None
        self.probationaryPeriod=0.01
        # Keep track of value range for spatial anomaly detection
        self.minVal = None
        self.maxVal = None
        # Set this to False if you want to get results based on raw scores
        # without using AnomalyLikelihood. This will give worse results, but
        # useful for checking the efficacy of AnomalyLikelihood. You will need
        # to re-optimize the thresholds when running with this setting.
        self.useLikelihood = True

        # Fraction outside of the range of values seen so far that will be considered
        # a spatial anomaly regardless of the anomaly likelihood calculation. This
        # accounts for the human labelling bias for spatial values larger than what
        # has been seen so far.
        # self.SPATIAL_TOLERANCE = 1000

    def SetConf(self, HTMInstanceHandler, CategoryID, IsSwaming, Steps, Days,Hours,Minutes,Seconds,
                IsPersistence, IsDayPersistence,spike):
        self.HTMInstanceHandler = HTMInstanceHandler
        self.CategoryID = CategoryID
        self.IsSwaming = IsSwaming
        self.Steps = Steps
        self.Days=Days
        self.Hours=Hours
        self.Minutes=Minutes
        self.Seconds=Seconds
        # self.Duration = Duration
        self.IsPersistence = IsPersistence
        self.IsDayPersistence=IsDayPersistence
        self.spike = spike


    def UpdateConf(self,CategoryID, IsSwaming):
        self.CategoryID = CategoryID
        self.IsSwaming = IsSwaming
        # self.Steps = Steps
        # # self.Duration = Duration
        # self.Days = Days
        # self.Hours = Hours
        # self.Minutes = Minutes
        # self.Seconds = Seconds
        # self.IsPersistence = IsPersistence
        # self.IsDayPersistence=IsDayPersistence
        # self.spike = spike

    def hendleAnomaly(self,rawScore,value,timestamp):
        # Update min/max values and check if there is a spatial anomaly
        spatialAnomaly = False
        if self.minVal != self.maxVal:
            tolerance = (self.maxVal - self.minVal) * SPATIAL_TOLERANCE
            maxExpected = self.maxVal + tolerance
            minExpected = self.minVal - tolerance
            if value > maxExpected or value < minExpected:
                spatialAnomaly = True
        if self.maxVal is None or value > self.maxVal:
            self.maxVal = value
        if self.minVal is None or value < self.minVal:
            self.minVal = value

        if self.useLikelihood:
            # Compute log(anomaly likelihood)
            anomalyScore = self.anomalyLikelihood.anomalyProbability(
                value, rawScore, timestamp)
            logScore = self.anomalyLikelihood.computeLogLikelihood(anomalyScore)
            finalScore = logScore
        else:
            finalScore = rawScore

        if spatialAnomaly:
            finalScore = 1.0

        return finalScore

    def updateCounter(self):
        self.counter2=0
    def schdule(self):
        # input = self.scrapp.GetActiveCount(self.CategoryID) #random.randint(0,100)
        with open('/home/sabahat/Desktop/Sabahat_data/HTM_Project/HTM/'+self.CategoryID+'.csv') as f:
            reader = csv.reader(f)
            input = list(reader)
        inputdata = {"timestamp": input[self.counter][0], "value": input[self.counter][1]}


        inputdata[inputdata.keys()[0]]=inputdata[inputdata.keys()[0]].replace('-', '/')
        try:

            inputdata[inputdata.keys()[0]] = datetime.datetime.strptime(inputdata[inputdata.keys()[0]], DATE_FORMAT)
        except:

            try:
                inputdata[inputdata.keys()[0]] = datetime.datetime.strptime(inputdata[inputdata.keys()[0]],
                                                                            DATE_FORMAT2)
            except:
                inputdata[inputdata.keys()[0]] = datetime.datetime.strptime(inputdata[inputdata.keys()[0]],
                                                                            DATE_FORMAT3)

        inputdata[inputdata.keys()[-1]] = float(inputdata[inputdata.keys()[-1]])

        try:

            response = self.HTM.GetPrediction(self.HTMInstanceHandler, self.CategoryID, inputdata,
                                                        self.IsSwaming,
                                                        self.Steps, self.Duration,
                                                        self.IsPersistence, self.spike)

        except Exception as e:
            print "Error in Getting Response from HTM Because "
            raise e
        abc = str(response['timeStamp'])
        response["timeStamp"] = abc
        response["AnomalyScore"]=self.hendleAnomaly(response["AnomalyScore"],response["InValue"],response["timeStamp"])
        response["Category"] = self.CategoryID
        temp = response["OneStep"]
        temp2 = response["nthStep"]
        self.PredArr.append(self.Predocted)
        self.ActualArr.append(float(inputdata["value"]))
        # print len(self.PredArr)
        # print len(self.ActualArr)
        MSE = np.square(np.subtract(self.ActualArr, self.PredArr)).mean()
        # MSE=mean_squared_error(self.ActualArr, self.PredArr)
        # CommError=math.sqrt(MSE)
        zip_object = zip(self.ActualArr, self.PredArr)
        difference = []
        for list1_i, list2_i in zip_object:
            difference.append(list1_i - list2_i)
        # print(difference)
        CommError=abs((sum(difference)/sum(self.ActualArr))*100)

        # CommError=np.mean(np.abs((self.ActualArr, self.PredArr) / self.ActualArr)) * 100
        # print CommError
        err=abs(1-(abs((float(inputdata["value"])-float(self.Predocted)))/abs(float(inputdata["value"]))))*100
        response["nthStep"] = self.nPredicted
        response["OneStep"] = self.Predocted
        response["NextOneStep"]=temp
        response["NextNthStep"]=temp2
        response["CommError"]=CommError
        response["err"]=err
        self.Predocted = temp
        self.nPredicted = temp2

        # print self.CategoryID
        try:
            # print "adding"
            self.db.ExecuteQuery(
                """INSERT INTO `{0}` (timeStmp,InValue,OneStep,nthStep,SwarmingStatus,Spike,AnomalyScore,IsSwarming,IsPersistence,IsDayPersistence,Accuracy) values('{1}','{2}','{3}','{4}','{5}','{6}','{7}',{8},{9},{10},{11})""".format(
                    str(self.CategoryID), response["timeStamp"], response["InValue"], response["OneStep"],
                    response["nthStep"], response["SwarmingStatus"], response["Spike"], response["AnomalyScore"],self.IsSwaming,self.IsPersistence,self.IsDayPersistence,response["err"]))
        except Exception as e:
            print "Error in Executing Insertion Query Because "
            raise e
        self.counter=self.counter+1
        self.counter2=self.counter2+1
        response["counter"] = self.counter2

        # response=json.dumps(response,indent=4,default=json_util.default)
        # socketio.emit(self.CategoryID, "hello",room=self.CategoryID)
        print "emitting"
        try:
            socketio.emit("data", response)
            socketio.sleep(2)
        except Exception as err:
            print "error in emitting results: ",err


        print response

        return response

    def setJob(self):
        query="""CREATE TABLE IF NOT EXISTS `{0}` (RecordNumber INT PRIMARY KEY AUTO_INCREMENT,timeStmp varchar(70),InValue varchar(20),OneStep varchar(20),nthStep varchar(20),SwarmingStatus varchar(100),Spike varchar(20),AnomalyScore varchar(20),IsSwarming BIT(1),IsPersistence BIT(1), IsDayPersistence BIT(1) ,Accuracy VARCHAR (20));""".format(
                self.CategoryID)

        # print query
        try:
            self.db.ExecuteQuery(query)
        except Exception as e:
            print "Error in Executing Create Table Query Because "
            raise e
        # print self.Days,self.Hours,self.Minutes,self.Seconds
        Days=self.Days * 24 * 60 * 60
        Hours = self.Hours * 60 * 60
        Minutes=self.Minutes*60
        duration=Days+Minutes+Hours+self.Seconds
        # print duration
        if self.IsPersistence:
            if duration>=600:
                duration=duration
            else:
                duration=600

        if self.useLikelihood:
            # Initialize the anomaly likelihood object
            numentaLearningPeriod = int(math.floor(self.probationaryPeriod / 2.0))
            self.anomalyLikelihood = anomaly_likelihood.AnomalyLikelihood(
                learningPeriod=numentaLearningPeriod,
                estimationSamples=self.probationaryPeriod - numentaLearningPeriod,
                reestimationPeriod=100
            )
        try:
            # self.scheduler.add_job(func=self.schdule, trigger="interval",days=Days,hours=Hours,minutes=Minutes, seconds=Seconds)
            self.scheduler.add_job(func=self.schdule, trigger="interval",seconds=duration)
        except Exception as e:
            print "Error in Adding Job To Scheduler Because "
            raise e
        try:
            self.scheduler.start()
        except Exception as e:
            print "Error in Starting Job Because "
            raise e


        # print self.CategoryID

    def StopJob(self):
        try:
            del self.HTM
            self.scheduler.shutdown()
        except Exception as e:
            print "Error in Stopping Job Because "
            raise e

    def __del__(self):
        print('Destructor called, Scheduler deleted.')

    # def socketemit(self):
    #     socketio.emit("helllo", "hellllllo")
    #     print("emitting")
    # def sockettest(self):
    #     try:
    #         # self.scheduler.add_job(func=self.schdule, trigger="interval",days=Days,hours=Hours,minutes=Minutes, seconds=Seconds)
    #         self.scheduler.add_job(func=self.socketemit(), trigger="interval",seconds=2)
    #     except Exception as e:
    #         print "Error in Adding Job To Scheduler Because "
    #         raise e
    #     try:
    #         self.scheduler.start()
    #     except Exception as e:
    #         print "Error in Starting Job Because "
    #         raise e
# scheduler.start()
if __name__ == '__main__':
    while True:
        # Checks whether a scheduled task
        # is pending to run or not
        schedule.run_pending()