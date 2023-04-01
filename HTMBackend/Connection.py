import mysql.connector
import pandas as pd
class Connection:
    def __init__(self):
        db1 = mysql.connector.connect(host="localhost", user="root", passwd="")
        cursor = db1.cursor()
        sql = """CREATE DATABASE IF NOT EXISTS HTM"""
        try:
            cursor.execute(sql)
        except Exception as ex:
            raise ex
        finally:
            if db1.is_connected():
                db1.close()
    def Connection(self):
        try:
            return mysql.connector.connect(
                host="localhost",
                user="root",
                password="",
                database="HTM",
                port=3306
            )
        except mysql.connector.Error as error:
            raise error


    def ExecuteQuery(self,sql):
        connection = self.Connection()

        try:
            if connection.is_connected():
                mycursor = connection.cursor()
                mycursor.execute(sql)
                connection.commit()
                return tuple([mycursor.rowcount, mycursor.lastrowid])
        except Exception as ex:
            raise ex
        finally:
            if connection.is_connected():
                connection.close()

    def FetchAsDictionaryList(self,sql):
        connection = self.Connection()
        try:
            if connection.is_connected():
                cur = connection.cursor()
                cur.execute(sql)
                sql_data = pd.DataFrame(cur.fetchall())
                if cur.rowcount == 0:
                    return dict()
                sql_data.columns = cur.column_names
                return sql_data.to_dict('records')
        except Exception as ex:
            raise ex
        finally:
            if connection.is_connected():
                connection.close()

    def FetchSingleRecord(self,sql):
        connection = self.Connection()
        try:
            if connection.is_connected():
                cursor = connection.cursor()
                cursor.execute(sql)
                record = cursor.fetchone()
                # print("records : ", record)
                return record
        except mysql.connector.Error as error:
            raise error
        finally:
            if connection.is_connected():
                connection.close()
