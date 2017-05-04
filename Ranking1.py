import pymysql

score = [None] * 24


connection = pymysql.connect(host='nvrv.crgn93rhkeiy.ap-south-1.rds.amazonaws.com', user='admin',password='smartrecruiter', db='nvrv', charset='utf8mb4',cursorclass=pymysql.cursors.DictCursor)
conn = connection.cursor()

skillsreqd = input()


for var in range(0,24):
    sql = "select skillsandexpertise from linkedin where id = %d" %(var+1)
    row = conn.execute(sql)
    row = conn.fetchall()
    row1 = str(row)
    score1 = row1.lower().count(skillsreqd.lower())*10
    score[var] = score1


for var in range(0,24):
    sql = "select experience from linkedin where id = %d" %(var+1)
    row = conn.execute(sql)
    row = conn.fetchall()
    row1 = str(row)
    score1 = row1.lower().count(skillsreqd.lower())*25
    score[var] = score[var] + score1


for var in range(0,24):
    sql = "select education from linkedin where id = %d" %(var+1)
    row = conn.execute(sql)
    row = conn.fetchall()
    row1 = str(row)
    score1 = row1.lower().count(skillsreqd.lower())*15
    score[var] = score[var] + score1

for var in range(0,24):
    sql = "select courses from linkedin where id = %d" %(var+1)
    row = conn.execute(sql)
    row = conn.fetchall()
    row1 = str(row)
    score1 = row1.lower().count(skillsreqd.lower())*10
    score[var] = score[var] + score1


for var in range(0,24):
    sql = "select certifications from linkedin where id = %d" %(var+1)
    row = conn.execute(sql)
    row = conn.fetchall()
    row1 = str(row)
    score1 = row1.lower().count(skillsreqd.lower())*10
    score[var] = score[var] + score1

for var in range(0,24):
    sql = "select likes from modifiedFblikes where id = %d" %(var+1)
    row = conn.execute(sql)
    row = conn.fetchall()
    row1 = str(row)
    score1 = row1.lower().count(skillsreqd.lower())*2
    score[var] = score[var] + score1

for var in range(0,24):
    sql = "select posts from ModifiedFbPosts where id = %d" %(var+1)
    row = conn.execute(sql)
    row = conn.fetchall()
    row1 = str(row)
    score1 = row1.lower().count(skillsreqd.lower())*5
    score[var] = score[var] + score1

for var in range(0,24):
    sql = "select tags from StackOverFlowData where id = %d" %(var+1)
    row = conn.execute(sql)
    row = conn.fetchall()
    row1 = str(row)
    score1 = row1.lower().count(skillsreqd.lower())*15
    score[var] = score[var] + score1

print(score)

