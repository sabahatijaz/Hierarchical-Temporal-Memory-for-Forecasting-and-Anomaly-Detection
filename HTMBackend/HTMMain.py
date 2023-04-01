import datetime
from random import random
import schedule
from flask import Flask, request, jsonify

import HtmWrap
from HtmWrap import HtmWrapp

app = Flask(__name__)
from HTMInstances import HTMInstances

#
# # HTM Imports
HTMInstanceHandler = HTMInstances()

@app.route('/HtmGetPrediction', methods=['POST'])
def HTMinstance():
    # Method To Be Called

    # print(request.data)
    CategoryID = request.json["CategoryID"]
    IsSwaming = request.json["IsSwaming"]
    Steps = request.json["Steps"]
    Duration = request.json["Duration"]
    IsPersistence = request.json["IsPersistence"]
    IsDayPersistence = request.json["IsDayPersistence"]
    inputdata=request.json["inputdata"]
    spike = request.json["Spike"]
    if IsPersistence == "false":
        IsPersistence = False
    else:
        IsPersistence = True
    if IsSwaming == "false":
        IsSwaming = False
    else:
        IsSwaming = True
    response = HtmWrap.HtmWrapp().GetPrediction(HTMInstanceHandler, CategoryID, inputdata, IsSwaming,
                                                    Steps, Duration,
                                                    IsPersistence, spike)

        # print HTMList
    return jsonify(response)


@app.route('/HtmGetPrediction', methods=['POST'])
def RemoveHTMinstance():
    CategoryID = request.json["CategoryID"]
    response = HtmWrap.HtmWrapp().removeAllData(CategoryID)
    return jsonify(response)