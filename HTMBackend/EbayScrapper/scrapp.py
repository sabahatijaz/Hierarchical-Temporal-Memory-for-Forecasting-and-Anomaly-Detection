import requests
from ebaysdk.finding import Connection
import bs4
import schedule
import pandas as pd
import datetime as datetime


class ItemsCount:
    def __init__(self):
        self.url = 'https://www.ebay.com/b/Laptops-Netbooks/175672/?rt=nc&LH_Sold=1'
        self.header = {'user-agent': 'Chrome/90.0.4430.93'}

    def GetActiveCount(self, categoryId):
        api = Connection(appid='FaisalRi-ecologix-PRD-b668815a4-f3c62444', siteid='EBAY-US', config_file=None)
        response = api.execute('findItemsAdvanced', {"keywords": "", "categoryId": categoryId,
                                                     "paginationInput": {"pageNumber": 1},
                                                     "sortOrder": "StartTimeNewest"}, )
        return response.reply.paginationOutput.totalEntries

    def GetSoldCount(self):
        r = requests.get(self.url, headers=self.header)
        data = r.text
        soup = bs4.BeautifulSoup(data, features="lxml")
        sold_count = soup.find('h2', attrs={'class': 'srp-controls__count-heading'})
        return str(sold_count.text).split()[0].replace(',', '')

    def scrapp(self):
        return str(datetime.datetime.now().strftime("%m/%d/%Y %H:%M"))+ ", " + self.GetActiveCount()

    def schedule(self):
        schedule.every(1).seconds.do(self.scrapp)

        while 1:
            schedule.run_pending()
