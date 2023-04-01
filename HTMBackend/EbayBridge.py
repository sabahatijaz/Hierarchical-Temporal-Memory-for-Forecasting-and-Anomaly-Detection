from flask import Flask, request, jsonify
from EbayScrapper.scrapp import ItemsCount
from Scheduler import Scheduler
# from HtmWrap import HtmWrapp
app = Flask(__name__)
from HTMInstances import HTMInstances

#
# # HTM Imports
HTMInstanceHandler = HTMInstances()

DATE_FORMAT = "%m/%d/%Y %H:%M"
test=ItemsCount()
JS=Scheduler()
HTMList=[]
HTMDurationList=[]
@app.route('/HtmEbayPrediction', methods=['POST'])
def HTMinstance():
    # Method To Be Called

    # print(request.data)
    CategoryID = request.json["CategoryID"]
    IsSwaming = request.json["IsSwaming"]
    Steps = request.json["Steps"]
    Duration = request.json["Duration"]
    IsPersistence = request.json["IsPersistence"]
    IsDayPersistence=request.json["IsDayPersistence"]
    spike=request.json["Spike"]

    if IsPersistence == "false":
        IsPersistence = False
    else:
        IsPersistence = True
    if IsSwaming == "false":
        IsSwaming = False
    else:
        IsSwaming = True
    NewHTM={CategoryID:Scheduler().setJob(HTMInstanceHandler, CategoryID ,IsSwaming, Steps, Duration,
                                                IsPersistence,spike)}
    NewHTMTime = {CategoryID: Duration}

    HTMDurationList.append(NewHTMTime)
    HTMList.append(NewHTM)
    print HTMList
    return jsonify("response")

if __name__ == '__main__':
        # count = 0
    app.run(debug=True)