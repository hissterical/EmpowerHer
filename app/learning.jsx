import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  FlatList,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const LearningScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('courses');

  // Sample data for courses
  const courses = [
    {
      id: '1',
      title: 'Budgeting Basics',
      category: 'Saving',
      duration: '15 min',
      level: 'Beginner',
      progress: 0.75
    },
    {
      id: '2',
      title: 'Intro to Stock Market',
      category: 'Investing',
      duration: '20 min',
      level: 'Beginner',
      progress: 0.3
    },
    {
      id: '3',
      title: 'Debt Payoff Strategies',
      category: 'Debt Management',
      duration: '12 min',
      level: 'Intermediate',
      progress: 0
    },
    {
      id: '4',
      title: 'Tax Deductions 101',
      category: 'Taxes',
      duration: '18 min',
      level: 'Beginner',
      progress: 0
    },
  ];

  // Sample data for webinars and podcasts
  const webinars = [
    {
      id: '1',
      title: 'Building Wealth as a Woman in Tech',
      speaker: 'Sarah Johnson',
      type: 'Webinar',
      date: '2023-03-15',
      duration: '45 min',
    },
    {
      id: '2',
      title: 'Investing in Your 30s',
      speaker: 'Michelle Rodriguez',
      type: 'Podcast',
      date: '2023-02-28',
      duration: '32 min',
    },
    {
      id: '3',
      title: 'Real Estate Investment Strategies',
      speaker: 'Jessica Williams',
      type: 'Webinar',
      date: '2023-01-20',
      duration: '60 min',
    },
  ];

  // Sample data for learning paths
  const learningPaths = [
    {
      id: '1',
      title: 'Financial Foundations',
      description: 'Master the basics of personal finance',
      coursesCount: 5,
      level: 'Beginner',
      progress: 0.4
    },
    {
      id: '2',
      title: 'Investing Mastery',
      description: 'Learn how to grow your wealth through investments',
      coursesCount: 7,
      level: 'Intermediate',
      progress: 0.2
    },
    {
      id: '3',
      title: 'Debt Freedom',
      description: 'Strategies to eliminate debt and stay debt-free',
      coursesCount: 4,
      level: 'Beginner',
      progress: 0
    },
  ];

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Render course item
  const renderCourseItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.courseCard}
      onPress={() => console.log('Course selected:', item.title)}
    >
      <View style={styles.courseImageContainer}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <View style={styles.durationBadge}>
          <Ionicons name="time-outline" size={12} color="#fff" />
          <Text style={styles.durationText}>{item.duration}</Text>
        </View>
        <View style={[styles.progressBar, { width: `${item.progress * 100}%` }]} />
      </View>
      <View style={styles.courseContent}>
        <Text style={styles.courseTitle}>{item.title}</Text>
        <View style={styles.courseFooter}>
          <Text style={styles.levelText}>{item.level}</Text>
          {item.progress > 0 ? (
            <Text style={styles.progressText}>{Math.round(item.progress * 100)}% complete</Text>
          ) : (
            <Text style={styles.startText}>Start</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  // Render webinar/podcast item
  const renderWebinarItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.webinarCard}
      onPress={() => console.log('Webinar selected:', item.title)}
    >
      <View style={styles.webinarImageContainer}>
        <View style={[
          styles.typeBadge, 
          { backgroundColor: item.type === 'Webinar' ? '#8A2BE2' : '#2e86de' }
        ]}>
          <Text style={styles.typeText}>{item.type}</Text>
        </View>
      </View>
      <View style={styles.webinarContent}>
        <Text style={styles.webinarTitle}>{item.title}</Text>
        <Text style={styles.speakerText}>
          <Ionicons name="person" size={14} color="#666" /> {item.speaker}
        </Text>
        <View style={styles.webinarFooter}>
          <Text style={styles.dateText}>
            <Ionicons name="calendar-outline" size={14} color="#666" /> {formatDate(item.date)}
          </Text>
          <Text style={styles.webinarDuration}>
            <Ionicons name="time-outline" size={14} color="#666" /> {item.duration}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Render learning path item
  const renderPathItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.pathCard}
      onPress={() => console.log('Learning path selected:', item.title)}
    >
      <View style={styles.pathImageContainer}>
        {item.progress > 0 && (
          <View style={[styles.pathProgressBar, { width: `${item.progress * 100}%` }]} />
        )}
      </View>
      <View style={styles.pathContent}>
        <Text style={styles.pathTitle}>{item.title}</Text>
        <Text style={styles.pathDescription}>{item.description}</Text>
        <View style={styles.pathFooter}>
          <Text style={styles.coursesCountText}>
            <Ionicons name="book-outline" size={14} color="#666" /> {item.coursesCount} courses
          </Text>
          <Text style={styles.pathLevelText}>
            <Ionicons name="stats-chart-outline" size={14} color="#666" /> {item.level}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Financial Literacy & Learning</Text>
      </View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'courses' && styles.activeTab]}
          onPress={() => setActiveTab('courses')}
        >
          <Text style={[styles.tabText, activeTab === 'courses' && styles.activeTabText]}>
            Courses
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'webinars' && styles.activeTab]}
          onPress={() => setActiveTab('webinars')}
        >
          <Text style={[styles.tabText, activeTab === 'webinars' && styles.activeTabText]}>
            Webinars & Podcasts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'paths' && styles.activeTab]}
          onPress={() => setActiveTab('paths')}
        >
          <Text style={[styles.tabText, activeTab === 'paths' && styles.activeTabText]}>
            Learning Paths
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        {activeTab === 'courses' && (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Bite-Sized Courses</Text>
              <TouchableOpacity onPress={() => console.log('See all courses')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.sectionDescription}>
              Short, interactive lessons on saving, investing, debt management, and taxes.
            </Text>
            
            <View style={styles.filterContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TouchableOpacity style={[styles.filterOption, styles.filterOptionSelected]}>
                  <Text style={[styles.filterText, styles.filterTextSelected]}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterOption}>
                  <Text style={styles.filterText}>Saving</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterOption}>
                  <Text style={styles.filterText}>Investing</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterOption}>
                  <Text style={styles.filterText}>Debt</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterOption}>
                  <Text style={styles.filterText}>Taxes</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
            
            <FlatList
              data={courses}
              renderItem={renderCourseItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          </View>
        )}
        
        {activeTab === 'webinars' && (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Expert Webinars & Podcasts</Text>
              <TouchableOpacity onPress={() => console.log('See all webinars')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.sectionDescription}>
              Insights from financial experts and successful women investors.
            </Text>
            
            <View style={styles.filterContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TouchableOpacity style={[styles.filterOption, styles.filterOptionSelected]}>
                  <Text style={[styles.filterText, styles.filterTextSelected]}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterOption}>
                  <Text style={styles.filterText}>Webinars</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterOption}>
                  <Text style={styles.filterText}>Podcasts</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterOption}>
                  <Text style={styles.filterText}>Upcoming</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterOption}>
                  <Text style={styles.filterText}>Recorded</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
            
            <FlatList
              data={webinars}
              renderItem={renderWebinarItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          </View>
        )}
        
        {activeTab === 'paths' && (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Personalized Learning Paths</Text>
              <TouchableOpacity onPress={() => console.log('See all paths')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.sectionDescription}>
              Based on financial literacy levels and goals.
            </Text>
            
            <View style={styles.assessmentCard}>
              <View style={styles.assessmentContent}>
                <Text style={styles.assessmentTitle}>Take the Financial Literacy Assessment</Text>
                <Text style={styles.assessmentDescription}>
                  Get a personalized learning path based on your current knowledge and financial goals.
                </Text>
                <TouchableOpacity 
                  style={styles.assessmentButton}
                  onPress={() => console.log('Start assessment')}
                >
                  <Text style={styles.assessmentButtonText}>Start Assessment</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.assessmentIconContainer}>
                <Ionicons name="clipboard-outline" size={50} color="#8A2BE2" />
              </View>
            </View>
            
            <FlatList
              data={learningPaths}
              renderItem={renderPathItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#8A2BE2',
    padding: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#8A2BE2',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#8A2BE2',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    color: '#8A2BE2',
    fontWeight: 'bold',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  filterContainer: {
    marginBottom: 15,
  },
  filterOption: {
    marginRight: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f8f8f8',
  },
  filterOptionSelected: {
    borderColor: '#8A2BE2',
    backgroundColor: '#f0e6ff',
  },
  filterText: {
    color: '#666',
  },
  filterTextSelected: {
    color: '#8A2BE2',
    fontWeight: 'bold',
  },
  courseCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  courseImageContainer: {
    height: 120,
    backgroundColor: '#e0e0e0',
    position: 'relative',
  },
  categoryBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#8A2BE2',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  durationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 4,
    backgroundColor: '#8A2BE2',
  },
  courseContent: {
    padding: 15,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelText: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#8A2BE2',
    fontWeight: 'bold',
  },
  startText: {
    fontSize: 12,
    color: '#8A2BE2',
    fontWeight: 'bold',
  },
  webinarCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    flexDirection: 'row',
  },
  webinarImageContainer: {
    width: 100,
    backgroundColor: '#e0e0e0',
    position: 'relative',
  },
  typeBadge: {
    position: 'absolute',
    top: 10,
    left: 0,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  typeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  webinarContent: {
    flex: 1,
    padding: 15,
  },
  webinarTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  speakerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  webinarFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
  webinarDuration: {
    fontSize: 12,
    color: '#666',
  },
  assessmentCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    flexDirection: 'row',
  },
  assessmentContent: {
    flex: 1,
    paddingRight: 10,
  },
  assessmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  assessmentDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  assessmentButton: {
    backgroundColor: '#8A2BE2',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  assessmentButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  assessmentIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
  },
  pathCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  pathImageContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    position: 'relative',
  },
  pathProgressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 8,
    backgroundColor: '#8A2BE2',
  },
  pathContent: {
    padding: 15,
  },
  pathTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  pathDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  pathFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coursesCountText: {
    fontSize: 12,
    color: '#666',
  },
  pathLevelText: {
    fontSize: 12,
    color: '#666',
  },
});

export default LearningScreen;