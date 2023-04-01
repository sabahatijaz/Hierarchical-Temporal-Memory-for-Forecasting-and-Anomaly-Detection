import csv
import datetime
from random import random
import schedule
from apscheduler.schedulers.background import BackgroundScheduler
from flask import request, jsonify
import random
from simplejson import JSONDecoder
from flask import Flask
import HtmWrap
from EbayScrapper.scrapp import ItemsCount
from Connection import Connection
# from HtmWrap import HtmWrapp
from flask_cors import cross_origin
from HTMInstances import HTMInstances
# from socketProvider import socketio
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"*": {"origins": "*"}})
from flask_socketio import SocketIO

# from main import app

socketio = SocketIO(app, cors_allowed_origins="*")

app.config['SECRET_KEY'] = 'secret'
#
# # HTM Imports
HTMInstanceHandler = HTMInstances()
HTMList = {}
db = Connection()
DATE_FORMAT = "%m %Y"
DATE_FORMAT2 = "%Y/%m/%d"
DATE_FORMAT3 = "%d/%m/%Y %M:%S"


@app.route('/HtmEbayStart', methods=['POST'])
@cross_origin(supports_credentials=True)
def HTMiinstance():
    # Method To Be Called

    # print(request.data)
    CategoryID = request.json["CategoryID"]
    print CategoryID
    IsSwaming = request.json["IsSwaming"]
    Steps = request.json["Steps"]
    # Duration = request.json["Duration"]
    Days = request.json["day"]
    Hours = request.json["hours"]
    Minutes = request.json["minutes"]
    Seconds = request.json["seconds"]
    IsPersistence = request.json["IsPersistence"]
    IsDayPersistence = request.json["IsDayPersistence"]
    spike = request.json["Spike"]
    if IsPersistence == "false":
        IsPersistence = False
    else:
        IsPersistence = True
    if IsSwaming == "false":
        IsSwaming = False
    else:
        IsSwaming = True
    if CategoryID in HTMList.keys():
        return jsonify("HTM Already Exists!!!")
    else:
        try:
            from Scheduler import Scheduler
            sch = Scheduler()
            sch.SetConf(HTMInstanceHandler, CategoryID, IsSwaming, Steps, Days, Hours, Minutes, Seconds,
                        IsPersistence, IsDayPersistence, spike)
            sch.setJob()
            HTMList[CategoryID] = sch
        except Exception as e:
            raise e
        return jsonify("HTM Started")


@app.route('/HTMConfUpdate', methods=['POST'])
@cross_origin(supports_credentials=True)
def UpdateConf():
    CategoryID = request.json["CategoryID"]
    IsSwarming = request.json["IsSwaming"]
    # Steps = request.json["Steps"]
    # # Duration = request.json["Duration"]
    # Days = request.json["days"]
    # Hours = request.json["hours"]
    # Minutes = request.json["minutes"]
    # Seconds = request.json["seconds"]
    # IsPersistence = request.json["IsPersistence"]
    # IsDayPersistence = request.json["IsDayPersistence"]
    # spike = request.json["Spike"]
    print "update called"
    if CategoryID in HTMList.keys():
        try:
            sch = HTMList[CategoryID]
        except Exception as e:
            raise e
        try:
            sch.UpdateConf(CategoryID=CategoryID, IsSwaming=IsSwarming, )
        except Exception as e:
            raise e
        return jsonify("Updated to:", IsSwarming)
    else:
        return jsonify("HTM Not Exist")


@app.route('/HTMStop', methods=['POST'])
@cross_origin(supports_credentials=True)
def StopHtm():
    CategoryID = request.json["CategoryID"]
    print(CategoryID)
    if CategoryID in HTMList.keys():

        try:
            sch = HTMList[CategoryID]
        except Exception as e:
            raise e
        try:
            sch.StopJob()
            del HTMList[CategoryID]
        except Exception as e:
            raise e
        try:
            htmwrap = HtmWrap.HtmWrapp()
            htmwrap.removeAllData(CategoryID)
            htmwrap.DelHTM(HTMInstanceHandler, CategoryID)
        except Exception as err:
            print "Error in removing Data"
        return jsonify("HTM Stopped")

    else:
        return jsonify("HTM NOT EXIST")


@app.route('/HTMReload', methods=['POST'])
@cross_origin(supports_credentials=True)
def HTMReload():
    print "Reload Called!!!!!!!!!!!!!"
    CategoryID = request.json["CategoryID"]
    data = ""
    if CategoryID in HTMList.keys():
        try:
            data = db.FetchAsDictionaryList(
                """SELECT * from `{0}` ORDER BY RecordNumber DESC LIMIT 15""".format(CategoryID))
            try:
                sch = HTMList[CategoryID]
            except Exception as e:
                raise e
            try:
                sch.updateCounter()
            except Exception as e:
                raise e

        except Exception as e:
            raise e
        return jsonify(data)

    else:
        return jsonify("HTM NOT EXIST")


@app.route('/HTMGetLast', methods=['POST'])
@cross_origin(supports_credentials=True)
def HTMGetLast():
    CategoryID = request.json["CategoryID"]
    if CategoryID in HTMList.keys():
        try:
            data = db.FetchAsDictionaryList(
                """SELECT * FROM `{0}` ORDER BY RecordNumber DESC LIMIT 1""".format(
                    CategoryID))
        except Exception as e:
            raise e
        # print CategoryID
        # print "data",data
        data[0]["CategoryID"] = CategoryID
        # sch=HTMList[CategoryID]
        # if len(sch.lastfifteen)>0:
        #     data1=sch.lastfifteen[-1]
        #     print "data1",data1
        return jsonify(data[0])
    else:
        return jsonify("HTM NOT EXIST")


@app.route('/GetAllIds', methods=['GET'])
@cross_origin(supports_credentials=True)
def GetAllIds():
    # print HTMList
    return jsonify(HTMList.keys())


@app.route('/HtmPrediction', methods=['POST'])
@cross_origin(supports_credentials=True)
def HtmPrediction():
    CategoryID = request.json["CategoryID"]
    IsSwaming = request.json["IsSwaming"]
    Steps = request.json["Steps"]
    Duration = 2
    IsPersistence = False
    counter = request.json["counter"]
    spike = ""
    with open(CategoryID) as f:
        reader = csv.reader(f)
        inputdata = list(reader)
    inputdata = {"Date": inputdata[counter][0], "value": inputdata[counter][1]}
    # print inputdata
    inputdata[inputdata.keys()[0]] = inputdata[inputdata.keys()[0]].replace('-', '/')
    inputdata[inputdata.keys()[1]] = float(inputdata[inputdata.keys()[1]])
    try:
        # bool(datetime.datetime.strptime(inputdata[inputdata.keys()[0]], DATE_FORMAT))
        # inputdata[inputdata.keys()[0]] = datetime.datetime.strftime(inputdata[inputdata.keys()[0]], DATE_FORMAT)
        # print(inputdata)
        inputdata[inputdata.keys()[0]] = datetime.datetime.strptime(inputdata[inputdata.keys()[0]], DATE_FORMAT)
        # print(type(inputdata[inputdata.keys()[0]]))
    except:
        # inputdata[inputdata.keys()[0]] = datetime.datetime.strftime(inputdata[inputdata.keys()[0]], DATE_FORMAT)
        # print(inputdata)
        try:
            inputdata[inputdata.keys()[0]] = datetime.datetime.strptime(inputdata[inputdata.keys()[0]], DATE_FORMAT2)
            # print(type(inputdata[inputdata.keys()[0]]))
        except:
            inputdata[inputdata.keys()[0]] = datetime.datetime.strptime(inputdata[inputdata.keys()[0]], DATE_FORMAT3)
            # print(type(inputdata[inputdata.keys()[0]]))
    response = HtmWrap.HtmWrapp().GetPrediction(HTMInstanceHandler, CategoryID, inputdata, IsSwaming, Steps, Duration,
                                                IsPersistence, spike)
    print response

    # print HTMList
    return jsonify(response)


if __name__ == '__main__':
    app.run(host="localhost", port=5000)
    socketio.run(app)
