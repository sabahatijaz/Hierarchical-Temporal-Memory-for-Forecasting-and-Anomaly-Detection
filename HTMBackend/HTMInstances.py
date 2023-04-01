import csv
import os
import pandas as pd

class HTMInstances:
    '''
    Class to maintain the record of HTM instance and their data Files
    This Class gives the functionaly to add the newly created  HTM instance to Dctionary, and create the CSV
    file of that HTM. It also gives the Swarming status based upon the swarmng thrshold
    '''
    def __init__(self):
        self.Instances = dict()
        self.SwarmingStatus = "Not Running"

    def CheckInstance(self, CategoryID):
        '''
        check if htm instance already exists
        Args:
            CategoryID:

        Returns:
            InstanceStatus

        '''
        InstanceStatus = False
        if CategoryID in self.Instances.keys():
            InstanceStatus = True
        return InstanceStatus

    def CheckFile(self, CategoryID):
        '''
        incase htm instance doesnot exists it will check if records file exists
        Args:
            CategoryID:

        Returns:
            True/False
        '''
        path1=os.path.join(os.getcwd(),'Data/')
        if not os.path.isdir(path1):
            os.mkdir(path1)
        path = os.path.join(os.getcwd(),'Data', CategoryID+'/')
        if os.path.isfile(path + CategoryID + '.csv'):
            return True
        else:
            return False

    def GetInstance(self,CategoryID):  #
        '''
        it will first check if true ok!!! if not it will check for records file if true!!
        it will check if number of records are enough for swarmig process!!!
        if not then will created HTM object with
        custom parameters and will iterate it through every record
        Args:
            CategoryID:

        Returns:
            InstanceStatus,Instance
        '''
        if self.CheckInstance(CategoryID):
            return 0, self.Instances.get(CategoryID)
        elif self.CheckFile(CategoryID) == True and self.CheckInstance(CategoryID) == False:
            return 1, ""
        else:
            return 2, ""

    def AddInstance(self, CategoryID, HTMInstance,data):
        '''
        it will called from flask to add a newly created HTMHandler class instance
        into dictionary,,, and create file for that category
        Args:
            CategoryID:
            HTMInstance:
            data:

        Returns:

        '''
        self.Instances[CategoryID] = HTMInstance
        # And then use the following to create the csv file:
        fieldnames = data.keys()
        path = os.path.join(os.getcwd(), 'Data',CategoryID+'/')
        if not os.path.isdir(path):
            os.mkdir(path)
        filename=path + CategoryID + '.csv'
        if os.path.isfile(filename):
            self.AddRecords(CategoryID,data)
        else:
            with open(path + CategoryID + '.csv', 'wb') as csvfile:
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                writer.writeheader()
                writer.writerow({str(data.keys()[0]):"datetime",str(data.keys()[-1]):"float"})
                writer.writerow({str(data.keys()[0]):"T"})
                writer.writerow(data)
                csvfile.close()

    def IsSwarmingDataReady(self, CategoryID):
        '''
        checks if number of records in file are enough for swarming
        Args:
            CategoryID:

        Returns:
            True/False
        '''
        path = os.path.join(os.getcwd(), 'Data',CategoryID+'/')
        file = open(path + CategoryID + ".csv")
        try:
            reader = csv.reader(file)
        except Exception as e:
            print "Error in reading CSV File "
            raise e

        lines = len(list(reader))
        if lines > 0 and lines % 1000 == 0:
            return True
        else:
            return False


    def AddRecords(self, CategoryID, data):
        '''
        add new record to already existing file
        Args:
            CategoryID:
            data:

        Returns:

        '''
        fieldnames = data.keys()
        path = os.path.join(os.getcwd(), 'Data',CategoryID+'/')
        with open(path + CategoryID + '.csv', 'ab') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writerow(data)
            csvfile.close()

    def DeleteHTM(self,CategoryID):
        try:
            del self.Instances[CategoryID]
        except Exception as err:
            print "ERROR IN DELETING INTERNAL HTM"
            print err